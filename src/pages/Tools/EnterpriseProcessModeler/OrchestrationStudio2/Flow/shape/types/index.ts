import { SVGAttributes } from "react";
import type { Node } from "@xyflow/react";

import Start from "./circle";
import Stop from "./circle-stop";
import RoundRectangle from "./round-rectangle";
import Rectangle from "./rectangle";
import Hexagon from "./hexagon";
import Diamond from "./diamond";
import Parallelogram from "./parallelogram";

// here we register all the shapes that are available
// you can add your own here
export const ShapeComponents = {
  Start: Start,
  "round-rectangle": RoundRectangle,
  rectangle: Rectangle,
  hexagon: Hexagon,
  diamond: Diamond,
  parallelogram: Parallelogram,
  Stop: Stop,
};

export type ShapeType = keyof typeof ShapeComponents;

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };
export type AttributesProps = {
  id: number;
  attribute_name: string;
  attribute_value: string;
};
export type ShapeNode = Node<{
  label: string;
  step_function: string;
  attributes: AttributesProps[];
  type: ShapeType;
  color: string;
}>;
