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
const StopNode = ({ data, isConnectable, selected }: ResizableNodeProps) => {
  return (
    <div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <NodeResizer isVisible={selected} minWidth={100} minHeight={30} />
      <div className="flex flex-col left-0">
        <h3 className="font-bold">{data?.label}</h3>
        {data?.description && <hr className="my-1" />}
        <h3 className="flex text-slate-500">{data?.description}</h3>
      </div>
    </div>
  );
};

export default memo(StopNode);
