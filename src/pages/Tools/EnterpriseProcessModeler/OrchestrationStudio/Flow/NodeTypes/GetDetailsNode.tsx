import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { ResizableNodeProps } from "./StartNode";

const GetDetailsNode = ({
  data,
  isConnectable,
  selected,
  positionAbsoluteX,
  positionAbsoluteY,
}: ResizableNodeProps) => {
  return (
    <div className="group">
      <div className="relative">
        <span className="absolute right-[-50px] top-[-50px] p-1 bg-black/30 text-white rounded-sm text-xs z-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex flex-col">
            <span className="flex">
              X: <p>{Math.floor(positionAbsoluteX)}</p>
            </span>
            <span className="flex">
              Y: <p>{Math.floor(positionAbsoluteY)}</p>
            </span>
          </span>
        </span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <NodeResizer isVisible={selected} minWidth={100} minHeight={30} />
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
      <Handle
        type="source"
        position={Position.Bottom}
        id="get-details-bottom"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(GetDetailsNode);
