import { DragEvent, FC } from "react";
import { useDnD } from "./DnDContext"; // Ensure the path is correct

const Sidebar: FC = () => {
  const { setType, setLabel } = useDnD();

  const nodes = [
    { label: "Start", type: "start" },
    { label: "Initialization", type: "initialization" },
    { label: "GetDetails", type: "getDetails" },
    { label: "Decision", type: "decision" },
    { label: "Alternate Process", type: "alternateProcess" },
    { label: "Stop", type: "stop" },
  ];

  // Handle drag start event
  const onDragStart = (
    event: DragEvent,
    node: { label: string; type: string }
  ) => {
    setType(node.type);

    setLabel(node.label);

    event.dataTransfer.setData("nodeLabel", node.label);
    event.dataTransfer.setData("nodeType", node.type);

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="bg-slate-100 p-2 rounded border w-[14rem] max-w-full">
      {/* Render draggable nodes */}
      {nodes.map((node, index) => (
        <div
          key={index}
          className={`dndnode ${node.type}`}
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
