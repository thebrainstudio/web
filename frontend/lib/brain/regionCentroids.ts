"use client";

/**
 * Compute the per-region centroid (mean vertex position) of the
 * fsaverage5 anatomical mesh used by the persistent brain stage.
 *
 * The Brain Studio's stylized `regions[i].position` in `lib/regions.ts`
 * lives in a hand-picked `[-1, 1]^3` decorative space — useful for the
 * Atlas 3D nav, but NOT the coordinate system of the actual GLB-loaded
 * fsaverage5 mesh. Anything that wants to position a marker *on* the
 * rendered brain (BrassHalos, hover affordances, the future Move 2
 * hover-coupled regions) needs centroids in the mesh's own local space.
 *
 * Source of truth:
 *   - `/meshes/fsaverage5_pial.glb`  the loaded geometry
 *   - `/vertex_to_region.json`       map of vertex index → region id
 *
 * Both files are already fetched + cached by `BrainAnatomy` (via
 * `useLoader` + a module-level fetch promise) so calling this from any
 * component reuses those caches.
 *
 * The first call is async (mesh + JSON load). Subsequent calls return
 * a cached `Map<RegionId, THREE.Vector3>` synchronously.
 */

import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import type { RegionId } from "@/lib/regions";

const MESH_URL = "/meshes/fsaverage5_pial.glb";
const VERTEX_TO_REGION_URL = "/vertex_to_region.json";

let _centroidsCache: Map<RegionId, THREE.Vector3> | null = null;
let _centroidsPromise: Promise<Map<RegionId, THREE.Vector3>> | null = null;

function findFirstMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let found: THREE.Mesh | null = null;
  scene.traverse((child) => {
    if (!found && (child as THREE.Mesh).isMesh) {
      found = child as THREE.Mesh;
    }
  });
  return found;
}

/**
 * Get region centroids in fsaverage5 mesh-local space.
 * Returns a cached value on subsequent calls.
 */
export async function getRegionCentroids(): Promise<Map<RegionId, THREE.Vector3>> {
  if (_centroidsCache) return _centroidsCache;
  if (_centroidsPromise) return _centroidsPromise;

  _centroidsPromise = (async () => {
    // Parallel fetch — mesh geometry + vertex assignment.
    const [gltf, vertexToRegion] = await Promise.all([
      new Promise<{ scene: THREE.Object3D }>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(MESH_URL, (data) => resolve(data as unknown as { scene: THREE.Object3D }), undefined, reject);
      }),
      fetch(VERTEX_TO_REGION_URL).then(
        (r) => r.json() as Promise<Record<string, RegionId>>,
      ),
    ]);

    const mesh = findFirstMesh(gltf.scene);
    if (!mesh) {
      throw new Error("[regionCentroids] no mesh found in GLB");
    }
    const position = (mesh.geometry as THREE.BufferGeometry).attributes
      .position as THREE.BufferAttribute;
    const positions = position.array as Float32Array;
    const nVerts = position.count;

    // Accumulate sum + count per region in a single pass.
    const sums = new Map<RegionId, { x: number; y: number; z: number; n: number }>();
    for (const [k, region] of Object.entries(vertexToRegion)) {
      const i = Number.parseInt(k, 10);
      if (Number.isNaN(i) || i < 0 || i >= nVerts) continue;
      const o = i * 3;
      const x = positions[o];
      const y = positions[o + 1];
      const z = positions[o + 2];
      const acc = sums.get(region) ?? { x: 0, y: 0, z: 0, n: 0 };
      acc.x += x;
      acc.y += y;
      acc.z += z;
      acc.n += 1;
      sums.set(region, acc);
    }

    const centroids = new Map<RegionId, THREE.Vector3>();
    for (const [region, acc] of sums) {
      if (acc.n === 0) continue;
      centroids.set(
        region,
        new THREE.Vector3(acc.x / acc.n, acc.y / acc.n, acc.z / acc.n),
      );
    }

    _centroidsCache = centroids;
    return centroids;
  })();

  try {
    return await _centroidsPromise;
  } catch (err) {
    _centroidsPromise = null;
    throw err;
  }
}

/**
 * Synchronous accessor — returns null until the centroids are loaded.
 * Use with a React effect that calls `getRegionCentroids()` once and
 * stores the result in state.
 */
export function getCachedRegionCentroids(): Map<RegionId, THREE.Vector3> | null {
  return _centroidsCache;
}
