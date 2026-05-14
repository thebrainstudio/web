# Start the TRIBE backend + a Cloudflare quick tunnel + capture the
# public URL.
#
# Usage:  .\scripts\start_with_tunnel.ps1
#
# What this does:
#   1. Activates the .venv-tribe Python 3.12 venv.
#   2. Boots `uvicorn app.main:app` on port 8765, with TRIBE_ENGINE=real
#      so the engine cascade prefers the real checkpoint.
#   3. Spawns `cloudflared tunnel --url http://localhost:8765` in
#      parallel and parses its assigned trycloudflare.com URL.
#   4. Writes the URL to `tunnel_url.txt` so the Vercel env-var update
#      script can pick it up.
#
# Stop with Ctrl+C; both processes exit cleanly.

$ErrorActionPreference = "Stop"
Set-Location -Path (Split-Path -Parent $PSScriptRoot)

$venvActivate = ".venv-tribe\Scripts\Activate.ps1"
if (-not (Test-Path $venvActivate)) {
    Write-Error "Python venv not found at $venvActivate. Run setup first."
}
& $venvActivate

# Boot the backend in a background job.
$env:TRIBE_ENGINE = "real"
$env:LOG_LEVEL = "INFO"
$env:ALLOWED_ORIGINS = "https://brain-studio-kappa.vercel.app,http://localhost:3000,http://127.0.0.1:3000"

Write-Host "Starting uvicorn on :8765 with TRIBE_ENGINE=real ..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    param($projectRoot)
    Set-Location -Path $projectRoot
    & .\.venv-tribe\Scripts\Activate.ps1
    $env:TRIBE_ENGINE = "real"
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8765 --log-level info
} -ArgumentList (Get-Location).Path

# Wait for the backend to respond on /healthz.
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    try {
        $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:8765/healthz" -TimeoutSec 2
        if ($resp.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
    Start-Sleep -Seconds 2
}
if (-not $ready) {
    Write-Error "Backend didn't respond on /healthz after 2 min. Check job output:"
    Receive-Job -Job $backendJob
    Stop-Job -Job $backendJob
    exit 1
}
Write-Host "Backend healthy." -ForegroundColor Green

# Now spawn the Cloudflare quick tunnel. It prints a line containing the
# assigned URL — we parse it from stderr.
$tunnelOut = Join-Path (Get-Location) "tunnel_url.txt"
if (Test-Path $tunnelOut) { Remove-Item $tunnelOut }

Write-Host "Starting Cloudflare quick tunnel ..." -ForegroundColor Cyan
$cloudflaredPath = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
if (-not (Test-Path $cloudflaredPath)) {
    $cloudflaredPath = "cloudflared"
}

# cloudflared writes the URL to stderr. We pipe it through PowerShell
# so we can both stream it to the user and grab the URL.
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $cloudflaredPath
$psi.Arguments = "tunnel --url http://localhost:8765 --no-autoupdate"
$psi.RedirectStandardError = $true
$psi.RedirectStandardOutput = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$tunnelProc = New-Object System.Diagnostics.Process
$tunnelProc.StartInfo = $psi
$tunnelProc.EnableRaisingEvents = $true

# Hook stderr so we can parse + tee.
Register-ObjectEvent -InputObject $tunnelProc -EventName ErrorDataReceived -Action {
    $line = $Event.SourceEventArgs.Data
    if (-not $line) { return }
    Write-Host "[tunnel] $line" -ForegroundColor DarkGray
    if ($line -match 'https://[a-z0-9-]+\.trycloudflare\.com') {
        $url = $matches[0]
        $url | Out-File -FilePath $script:tunnelOutCapture -Encoding utf8 -NoNewline
        Write-Host ""
        Write-Host "Tunnel URL: $url" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Set NEXT_PUBLIC_TRIBE_API_BASE=$url in Vercel project settings."
        Write-Host "  2. Redeploy frontend: 'cd ../frontend && vercel --prod --yes'"
    }
} | Out-Null

$script:tunnelOutCapture = $tunnelOut

[void]$tunnelProc.Start()
$tunnelProc.BeginErrorReadLine()
$tunnelProc.BeginOutputReadLine()

Write-Host "Tunnel + backend running. Ctrl+C to stop." -ForegroundColor Cyan
try {
    while (-not $tunnelProc.HasExited) {
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host "Shutting down..." -ForegroundColor Cyan
    if (-not $tunnelProc.HasExited) { $tunnelProc.Kill() }
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
}
