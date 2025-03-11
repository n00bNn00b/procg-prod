import { NodeToolbar } from "@xyflow/react";

const colors = [
  "#FF0000",
  "#EA9C41",
  "#EBC347",
  "#549C30",
  "#3F8AE2",
  "#803DEC",
];

type ShapeNodeToolbarProps = {
  activeColor: string;
  onColorChange?: (color: string) => void;
};

function ShapeNodeToolbar({
  onColorChange = () => false,
  activeColor,
}: ShapeNodeToolbarProps) {
  return (
    <NodeToolbar className="nodrag" offset={32}>
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          className={`color-swatch ${color === activeColor ? "active" : ""}`}
        />
      ))}
    </NodeToolbar>
  );
}

export default ShapeNodeToolbar;
