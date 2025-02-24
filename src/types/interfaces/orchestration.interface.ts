import { Edge, Node } from "@xyflow/react";
export interface IOrchestrationDataTypes {
  process_id: number;
  process_name: string;
  process_structure: StructureTypes;
}
export interface StructureTypes {
  nodes: Node[];
  edges: Edge[];
}
// // Node
// export interface Node {
//   id: number;
//   type: string;
//   position: position;
//   data: data;
//   measured: measured;
// }

// export interface position {
//   x: number;
//   y: number;
// }
// export interface data {
//   label: string;
// }
// export interface measured {
//   width: number;
//   height: number;
// }
// // Edge
// export interface Edge {
//   source: string;
//   target: string;
//   id: string;
//   type: string;
//   markerEnd: markerEnd;
// }
// export interface markerEnd {
//   type: string;
// }
