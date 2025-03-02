import { DragEvent, FC } from "react";
import { useDnD } from "./DnDContext";
import "./index.css";
const Sidebar: FC = () => {
  const { setType, setLabel } = useDnD();

  const nodes = [
    { label: "Start", type: "start", color: "green" },
    { label: "Initialization", type: "initialization", color: "lightgray" },
    { label: "GetDetails", type: "getDetails", color: "lightgray" },
    { label: "Decision", type: "decision", color: "lightgray" },
    {
      label: "Alternate Process",
      type: "alternateProcess",
      color: "lightgray",
    },
    { label: "Stop", type: "stop", color: "red" },
  ];

  // Handle drag start event
  const onDragStart = (
    event: DragEvent,
    node: { label: string; type: string; color: string }
  ) => {
    setType(node.type);

    setLabel(node.label);

    event.dataTransfer.setData("nodeLabel", node.label);
    event.dataTransfer.setData("nodeType", node.type);
    event.dataTransfer.setData("nodeColor", node.color);

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col  bg-slate-100 p-2 rounded border w-[11rem] max-w-full">
      {/* Render draggable nodes */}
      {nodes.map((node, index) => (
        <div
          key={index}
          className={`${node.type} hover:bg-slate-300`}
          style={{ backgroundColor: node.color, marginBottom: "3px" }}
          onDragStart={(event) => onDragStart(event, node)}
          draggable
        >
          {node.label}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
