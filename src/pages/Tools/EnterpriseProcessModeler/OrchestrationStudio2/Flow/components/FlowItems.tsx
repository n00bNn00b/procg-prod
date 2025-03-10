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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { IOrchestrationDataTypes } from "@/types/interfaces/orchestration.interface";
import { Edge } from "@xyflow/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ShapeNode } from "../shape/types";
interface IFlowItemsProps {
  setNodes: React.Dispatch<React.SetStateAction<ShapeNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedFlowData: IOrchestrationDataTypes | undefined;
  setSelectedFlowData: React.Dispatch<
    React.SetStateAction<IOrchestrationDataTypes | undefined>
  >;
}
const FlowItems = ({
  setNodes,
  setEdges,
  selectedFlowData,
  setSelectedFlowData,
}: IFlowItemsProps) => {
  const api = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [flowsData, setFlowsData] = useState<IOrchestrationDataTypes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resFlows = await api.get("/orchestration-studio-process");

        setFlowsData(resFlows.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.log(error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (selectedFlowName !== "") {
  //         setIsLoading(true);
  //         const res = await api.get(
  //           `/orchestration-studio-process/${selectedFlowName}`
  //         );
  //         setSelectedFlowData(res.data);
  //         setEdges(res.data.process_structure.edges);
  //         setNodes(res.data.process_structure.nodes);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [selectedFlowName]);
  console.log(selectedFlowData, "selectedFlowData");
  return (
    <div className="text-Red-100">
      {/*Select Flow */}
      <div
        className={`z-50 absolute top-[2px] left-[220px] p-2 flex  items-center justify-center gap-1`}
      >
        <h3>Flow Name:</h3>

        {/* select flow */}
        {flowsData.length > 0 && (
          <Select
            defaultValue={selectedFlowData?.process_name ?? ""}
            onValueChange={(flow: string) => {
              const selectedFlow = JSON.parse(flow) as IOrchestrationDataTypes;
              setSelectedFlowData(selectedFlow);
              setNodes(selectedFlow.process_structure.nodes);
              setEdges(selectedFlow.process_structure.edges);
              // setSelectedFlowName(process_name);
              // setNewProcessName("");
              // setCreateNewFlow(false);
              // setSelectedEdge(undefined);
              // setSelectedNode(undefined);
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger className="w-[230px] h-[30px] bg-white">
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
                    value={JSON.stringify(flow)}
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
    </div>
  );
};

export default FlowItems;
