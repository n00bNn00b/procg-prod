import { DragEvent, FC } from "react";
import { useDnD } from "./DnDContext";

const Sidebar: FC = () => {
  const { setType, setLabel } = useDnD();

  const nodes = [
    { label: "Start", type: "start", color: "#11c02b" },
    { label: "Initialization", type: "initialization", color: "#fff" },
    { label: "GetDetails", type: "getDetails", color: "#fff" },
    { label: "Decision", type: "decision", color: "#fff" },
    { label: "Alternate Process", type: "alternateProcess", color: "#fff" },
    { label: "Stop", type: "stop", color: "#e11212" },
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
    <div className="bg-slate-100 p-2 rounded border w-[11rem] max-w-full">
      {/* Render draggable nodes */}
      {nodes.map((node, index) => (
        <div
          key={index}
          className={`dndnode ${node.type}`}
          style={{ backgroundColor: node.color }}
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
