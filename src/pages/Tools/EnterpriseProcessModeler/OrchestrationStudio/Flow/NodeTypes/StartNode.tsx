import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
export interface ResizableNodeProps {
  data: {
    label: string;
    attributes: Attributes[];
  };
  isConnectable: boolean;
  selected: boolean;
}
interface Attributes {
  id: number;
  attribute_name: string;
  attribute_value: string;
}
const StartNode = ({ data, isConnectable, selected }: ResizableNodeProps) => {
  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      <NodeResizer isVisible={selected} minWidth={100} minHeight={30} />
      <div className="flex flex-col left-0">
        {Object.keys(data).map((key) => (
          <div key={key}>
            {key === "label" && <h3 className="font-bold">{data[key]}</h3>}
            {key === "attributes" && (
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

export default memo(StartNode);
