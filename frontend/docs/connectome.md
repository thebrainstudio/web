# Connectome

Eight canonical white-matter tracts are rendered as glowing 3D tube geometry inside the persistent brain, toggled from each Atlas page's sidebar panel.

## Honest disclosure

The tract geometry is **stylized**. The current implementation draws quadratic Bezier curves between the canonical region positions in `lib/regions.ts` and sweeps them into `TubeGeometry`. The endpoints, functional descriptions, discovery credits, and citations are faithful to the literature; the geometric path is not real diffusion-MRI tractography.

A real-tractography implementation would replace the synthetic curves with imported tract meshes (HCP1065 or DSI Studio HCP-842, both of which are openly licensed). The toggle-and-fade architecture would not need to change; only the geometry pipeline.

## The eight tracts

Defined in `lib/tracts.ts`. Each entry has endpoints (canonical region IDs), function description, discovery credit, citation id, related disorders.

| Tract | Endpoints | Function |
|---|---|---|
| Arcuate fasciculus | IFG-L ↔ pSTG-L | Dorsal language stream; sound-to-articulation. |
| Uncinate fasciculus | ATL-L ↔ vmPFC | Conceptual-knowledge ↔ affective valuation. |
| Cingulum bundle | PCC ↔ vmPFC | Default-mode-network structural backbone. |
| Superior longitudinal fasciculus | dmPFC ↔ AGL-L | Frontal-parietal attention + working memory. |
| Inferior longitudinal fasciculus | AGL-L ↔ ATL-L | Ventral visual stream → conceptual meaning. |
| Fornix | Hipp-L ↔ vmPFC | Principal hippocampal output. |
| Perforant pathway | ATL-L ↔ Hipp-L | Entorhinal → hippocampus; memory encoding. |
| Corpus callosum | AGL-L ↔ AGL-R | Major interhemispheric commissure. |

The endpoint mapping deliberately uses regions in our canonical 20. Real tracts span more than two endpoints (the cingulum bundle, for example, runs along the entire cingulate gyrus), but the stylized single-curve representation is the visualization budget the current architecture supports.

## File layout

```
lib/
  tracts.ts             # TractId + Tract type + TRACTS registry +
                        # tractsForRegion() helper
  connectomeState.ts    # Zustand store: visibleTracts (Set) + focusMode

components/brain/
  Tracts.tsx            # TubeGeometry per tract; opacity tweens
  ConnectomePanel.tsx   # Atlas-sidebar UI: per-tract toggles +
                        # focus-mode brain anchor override
  BrainAnatomy.tsx      # mounts Tracts inside the brain group
```

## How a tract becomes visible

1. User opens an Atlas page.
2. The Connectome panel in the sidebar lists the tracts connected to that region (via `tractsForRegion(regionId)`).
3. User clicks a tract toggle.
4. `useConnectomeState.toggleTract(id)` adds the id to `visibleTracts` and sets `focusMode = true`.
5. The `ConnectomePanel` `useEffect` watches `focusMode` and overrides the Atlas brain anchor with a centered larger transform so the tracts are visible.
6. `Tracts.tsx` is mounted inside `BrainAnatomy`'s group. Its `useFrame` loop reads `useConnectomeState.getState().visibleTracts` and tweens per-tract opacity toward 1 (visible) or 0 (hidden).
7. The Bloom postprocessor in `BrainStageClient` catches the emissive brass color and the tracts glow.

On unmount of `ConnectomePanel` (i.e., navigation away from the Atlas page), `clearTracts()` is called to keep the next page clean.

## How to add a new tract

1. Add a new `TractId` to the union in `lib/tracts.ts` and a new entry to `TRACTS` with endpoints (canonical region IDs), description, discovery credit, citation id, and related disorders.
2. Append the new id to `TRACT_ORDER`.
3. Add a citation to `lib/citations.ts` if needed (PubMed-verify it first).
4. The Atlas sidebar picks the new tract up automatically via `tractsForRegion()`; the search palette picks it up via `buildTractEntries()`.

## How to add real HCP tract data

This is the path the brief originally envisioned. The shipped synthetic implementation is the minimum-viable version.

1. Choose a tract atlas: HCP1065 or DSI Studio HCP-842 (both openly licensed). The DSI Studio atlas ships .nii.gz volumes and .tt.gz tract files.
2. Convert each tract to a low-poly mesh (5–8k triangles after decimation). VTK PolyData or PLY format.
3. Place files in `public/tracts/<tract-id>.glb` (after a Blender or trimesh export).
4. Replace `buildTubeGeometry()` in `components/brain/Tracts.tsx` with a `useGLTF` loader per tract id.
5. Keep the per-tract `MeshStandardMaterial` settings (brass color, emissive intensity, transparent) — they govern the visual appearance regardless of geometry source.
6. Update the disclosure in `messages/*.json` (`atlas.connectome.disclosure`) to credit the atlas source.

Performance budget: maximum 4–5 tracts visible at once during region selection; "Show all" mode at reduced detail. The current synthetic implementation is well below this budget; real meshes would tighten it.

## Cross-references

- Connectome → Atlas (every tract toggle lives on the Atlas region pages)
- Connectome → Bridges (the cingulum bundle and uncinate fasciculus are explicitly discussed in Bridges § 2 and § 7)
- Search palette → Connectome (each tract is a `concept` entry in the search index, linking back to its first-endpoint Atlas page)
