import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IOrchestrationDataTypes,
  IOrchestrationDataTypes2,
} from "@/types/interfaces/orchestration.interface";
import { Edge } from "@xyflow/react";
import { ShapeNode } from "../../shape/types";
interface IFlowItemsProps {
  flowsData: IOrchestrationDataTypes[];
  setNodes: React.Dispatch<React.SetStateAction<ShapeNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedFlowData: IOrchestrationDataTypes | undefined;
  setSelectedFlowData: React.Dispatch<
    React.SetStateAction<IOrchestrationDataTypes2 | undefined>
  >;
  setSelectedFlowName: React.Dispatch<React.SetStateAction<string>>;
  handleCloseAfterSelectAFlow: () => void;
}
const FlowItems = ({
  flowsData,
  selectedFlowData,
  setSelectedFlowName,
  handleCloseAfterSelectAFlow,
}: IFlowItemsProps) => {
  return (
    <>
      {/*Select Flow */}
      <div className={`p-2 flex items-center justify-center gap-1`}>
        <h3>Flow Name:</h3>

        {/* select flow */}
        {flowsData.length > 0 && (
          <Select
            value={selectedFlowData?.process_name ?? ""}
            onValueChange={(process_name: string) => {
              setSelectedFlowName(process_name);
              handleCloseAfterSelectAFlow();
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger className="w-[230px] h-[30px] ">
                    <SelectValue placeholder="Select a Flow" />
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{selectedFlowData?.process_name ?? "Select a Flow"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <SelectContent className=" max-h-[15rem] ">
              <SelectGroup>
                {/* <SelectLabel>Flows</SelectLabel> */}
                {flowsData.map((flow) => (
                  <SelectItem
                    key={flow.process_id}
                    value={flow.process_name}
                    className="cursor-pointer "
                  >
                    {flow.process_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
};

export default FlowItems;
