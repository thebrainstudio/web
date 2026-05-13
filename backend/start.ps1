# Run the backend dev server with auto-reload.
# Usage: ./start.ps1
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
