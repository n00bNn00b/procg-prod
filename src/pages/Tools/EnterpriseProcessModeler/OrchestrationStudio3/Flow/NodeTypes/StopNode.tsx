import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { ResizableNodeProps } from "./StartNode";
import "../index.css";

const StopNode = ({
  data,
  isConnectable,
  positionAbsoluteX,
  positionAbsoluteY,
}: ResizableNodeProps) => {
  // For coordinates
  const [coordinates, setCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Handle mouse enter to get node position
  const onMouseEnter = () => {
    setCoordinates({
      x: Math.floor(positionAbsoluteX),
      y: Math.floor(positionAbsoluteY),
    });
  };

  // Reset coordinates on mouse leave
  const onMouseLeave = () => {
    setCoordinates(null);
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="react-flow__node stop cursor-grab"
    >
      {coordinates && (
        <div
          style={{
            position: "absolute",
            right: -50,
            top: -55,
            padding: "5px",
            background: "rgba(0, 0, 0, 0.3)",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 100,
          }}
        >
          <span className="flex flex-col">
            <span className="flex">
              X: <p> {Math.floor(positionAbsoluteX)}</p>
            </span>
            <span className="flex">
              Y: <p>{Math.floor(positionAbsoluteY)}</p>
            </span>
          </span>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      {/* <NodeResizer isVisible={selected} minWidth={50} minHeight={30} /> */}
      <div className="flex flex-col left-0">
        {Object.keys(data).map((key) => (
          <div key={key}>
            {key === "label" && <h3 className="font-bold">{data[key]}</h3>}
            {key === "attributes" && data.attributes.length > 0 && (
              <>
                <hr />
                {data.attributes.map((item) => (
                  <div key={item.id}>
                    <h3 className="flex text-slate-700 items-center">
                      <span className="w-1 h-1 rounded-full mr-1 bg-black"></span>
                      <p> {item.attribute_value}</p>
                    </h3>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(StopNode);
