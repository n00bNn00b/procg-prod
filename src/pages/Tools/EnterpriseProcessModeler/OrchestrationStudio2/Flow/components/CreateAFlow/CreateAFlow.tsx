import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { IOrchestrationDataTypes2 } from "@/types/interfaces/orchestration.interface";
interface ICreateAFlowProps {
  actionType: string;
  flowsData: IOrchestrationDataTypes2[];
  selectedFlowData?: IOrchestrationDataTypes2 | undefined;
  newProcessName: string;
  setNewProcessName: React.Dispatch<React.SetStateAction<string>>;
  setCreateNewFlow: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFlowData: React.Dispatch<
    React.SetStateAction<IOrchestrationDataTypes2 | undefined>
  >;
  setSelectedFlowName: React.Dispatch<React.SetStateAction<string>>;
  setIsEditFlowName: React.Dispatch<React.SetStateAction<boolean>>;
  closeAllProgress: () => void;
}
const CreateAFlow = ({
  actionType,
  flowsData,
  selectedFlowData,
  newProcessName,
  setNewProcessName,
  setCreateNewFlow,
  setSelectedFlowData,
  setSelectedFlowName,
  setIsEditFlowName,
  closeAllProgress,
}: ICreateAFlowProps) => {
  const api = useAxiosPrivate();
  console.log(actionType, "actionType");
  const handleCreateNewFlow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (flowsData) {
        const flow = flowsData.find(
          (flow) => flow.process_name === newProcessName
        );
        if (flow) {
          toast({
            title: "Info!!",
            description: "Flow already exists.",
          });
        } else {
          const maxID = Math.max(...flowsData.map((flw) => flw.process_id));
          const postData = {
            process_id: maxID + 1,
            process_name: newProcessName,
            process_structure: { nodes: [], edges: [] },
          };
          const putData = {
            process_name: newProcessName,
          };

          if (actionType === "CreateAFlow") {
            console.log(actionType, postData, "actionType");
            const res = await api.post(
              "/orchestration-studio-process",
              postData
            );
            console.log(res, "res");
            if (res) {
              setSelectedFlowName(newProcessName);
              closeAllProgress();
              setCreateNewFlow(false);
              setSelectedFlowData(postData);

              toast({
                title: "Success",
                description: "New flow created successfully.",
              });
            }
          } else if (actionType === "EditFlowName") {
            console.log(actionType, putData, "actionType");
            const res = await api.put(
              `/orchestration-studio-process/process-name/${selectedFlowData?.process_id}`,
              putData
            );
            console.log(res, "res");
            if (res) {
              setIsEditFlowName(false);
              setSelectedFlowName(newProcessName);
              toast({
                title: "Success",
                description: "Flow name updated successfully.",
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute left-[50%] z-50 translate-x-[-50%] bg-slate-300 p-3 border rounded">
      <form onSubmit={handleCreateNewFlow}>
        <input
          type="text"
          value={newProcessName ?? ""}
          placeholder="Flow Name"
          onChange={(e) => {
            setNewProcessName(e.target.value);
          }}
          autoFocus
          className="px-2 py-1 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-slate-200 p-1 rounded-l-md border-black border hover:bg-slate-300 hover:shadow"
        >
          Save
        </button>
        <button
          className="bg-slate-200 p-1 rounded-r-md border-black border hover:bg-slate-300 hover:shadow"
          onClick={(e) => {
            e.preventDefault();
            setCreateNewFlow(false);
            setIsEditFlowName(false);
            setNewProcessName("");
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateAFlow;
