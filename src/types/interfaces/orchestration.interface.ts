import { Edge, Node } from "@xyflow/react";
import { SVGAttributes } from "react";

interface Attributes {
  id: number;
  attribute_name: string;
  attribute_value: string;
}

export interface ResizableNodeProps extends Partial<SVGAttributes<SVGElement>> {
  id: string;
  data: {
    label: string;
    attributes: Attributes[];
  };
  isConnectable: boolean;
  selected: boolean;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
}
export interface prop extends Partial<SVGAttributes<SVGElement>> {}

export interface IOrchestrationDataTypes {
  process_id: number;
  process_name: string;
  process_structure: StructureTypes;
}
export interface StructureTypes {
  nodes: Node[];
  edges: Edge[];
}
export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

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
