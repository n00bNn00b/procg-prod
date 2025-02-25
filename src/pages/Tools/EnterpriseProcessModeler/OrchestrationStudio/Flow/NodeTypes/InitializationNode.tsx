import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
interface ResizableNodeProps {
  data: {
    label: string;
    type: string;
    description: string;
  };
  isConnectable: boolean;
  selected: boolean;
}
const InitializationNode = ({
  data,
  isConnectable,
  selected,
}: ResizableNodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <NodeResizer isVisible={selected} minWidth={100} minHeight={30} />
      <div className="flex flex-col left-0">
        <h3 className="font-bold">{data?.label}</h3>
        {data?.description && <hr className="my-1" />}
        <h3 className="flex text-slate-500">{data?.description}</h3>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="initialization-bottom"
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(InitializationNode);
