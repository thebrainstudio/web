# Precomputed predictions

This folder holds precomputed TRIBE v2 prediction JSONs produced on Colab Pro.

## Schema

```json
{
  "stimulus_id": "mirror_example_01",
  "modality": "text",
  "input_preview": "The first lines of the input stimulus...",
  "regions": {
    "ifg_left": 0.81,
    "pstg_left": 0.74,
    "atl_left": 0.62
  },
  "metadata": {
    "model_version": "tribev2",
    "checkpoint_sha": "f894e783",
    "generated_at": "2026-05-13T00:00:00Z",
    "hemodynamic_lag_s": 5
  }
}
```

Region keys map to ids in `frontend/lib/regions.ts`.

Activation values are 0..1 (normalized within the predicted volume).
