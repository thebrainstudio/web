/**
 * SWC parser. SWC is the canonical text format for neuron reconstructions:
 * one sample point per line, whitespace-separated:
 *
 *   id type x y z radius parent_id
 *
 * `type` integers, per the SWC convention:
 *   0  undefined
 *   1  soma
 *   2  axon
 *   3  basal dendrite
 *   4  apical dendrite
 *   5  custom (often used for forks/junctions)
 *   6  unspecified neurite
 *   7  glial process
 *
 * parent_id = -1 marks a root node. Otherwise each non-root node connects
 * to its parent — those are the segments we render as tubes/lines.
 */

export type SwcType =
  | "undefined"
  | "soma"
  | "axon"
  | "basal_dendrite"
  | "apical_dendrite"
  | "fork"
  | "neurite"
  | "glial_process";

const TYPE_BY_CODE: Record<number, SwcType> = {
  0: "undefined",
  1: "soma",
  2: "axon",
  3: "basal_dendrite",
  4: "apical_dendrite",
  5: "fork",
  6: "neurite",
  7: "glial_process",
};

export type SwcNode = {
  id: number;
  type: SwcType;
  x: number;
  y: number;
  z: number;
  radius: number;
  parent: number;
};

export type SwcSegment = {
  a: SwcNode;
  b: SwcNode;
  /** Inherit b's type — the segment's "kind" is determined by the
      destination node (the part of the neuron the segment grows into). */
  type: SwcType;
};

export type SwcParsed = {
  nodes: SwcNode[];
  /** node id -> node (sparse; ids are 1-indexed in SWC files) */
  byId: Map<number, SwcNode>;
  segments: SwcSegment[];
  bounds: { min: [number, number, number]; max: [number, number, number] };
  centroid: [number, number, number];
  /** Longest cross-axis span — useful for normalizing into Three.js units. */
  span: number;
  /** Total node count (lines parsed, excluding comments). */
  vertexCount: number;
};

export function parseSwc(text: string): SwcParsed {
  const nodes: SwcNode[] = [];
  const byId = new Map<number, SwcNode>();

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 7) continue;
    const id = parseInt(parts[0], 10);
    const typeCode = parseInt(parts[1], 10);
    const x = parseFloat(parts[2]);
    const y = parseFloat(parts[3]);
    const z = parseFloat(parts[4]);
    const radius = parseFloat(parts[5]);
    const parent = parseInt(parts[6], 10);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
    const node: SwcNode = {
      id,
      type: TYPE_BY_CODE[typeCode] ?? "undefined",
      x,
      y,
      z,
      radius: Number.isFinite(radius) ? radius : 0.5,
      parent,
    };
    nodes.push(node);
    byId.set(id, node);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }

  const segments: SwcSegment[] = [];
  for (const n of nodes) {
    if (n.parent < 0) continue;
    const p = byId.get(n.parent);
    if (!p) continue;
    segments.push({ a: p, b: n, type: n.type });
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ);

  return {
    nodes,
    byId,
    segments,
    bounds: { min: [minX, minY, minZ], max: [maxX, maxY, maxZ] },
    centroid: [cx, cy, cz],
    span,
    vertexCount: nodes.length,
  };
}

/** Color palette for the four primary segment kinds in the brand. */
export const SWC_COLORS: Record<SwcType, [number, number, number]> = {
  // RGB in 0..1
  undefined: [0.94, 0.91, 0.85],       // bone cream
  soma: [0.99, 0.94, 0.27],            // bright yellow — cell bodies catch the eye
  axon: [0.36, 0.78, 0.84],            // cyan glow — output pathway
  basal_dendrite: [0.94, 0.91, 0.85],  // bone cream — receiving
  apical_dendrite: [0.79, 0.66, 0.38], // brass — the iconic apical trunk
  fork: [0.94, 0.91, 0.85],            // treat as dendrite
  neurite: [0.94, 0.91, 0.85],
  glial_process: [0.91, 0.63, 0.29],   // soft amber — glia
};
