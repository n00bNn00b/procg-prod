import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { IOrchestrationDataTypes2 } from "@/types/interfaces/orchestration.interface";
interface ICreateAFlowProps {
  flowsData: IOrchestrationDataTypes2[];
  newProcessName: string;
  setNewProcessName: React.Dispatch<React.SetStateAction<string>>;
  setCreateNewFlow: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFlowData: React.Dispatch<
    React.SetStateAction<IOrchestrationDataTypes2 | undefined>
  >;
  setSelectedFlowName: React.Dispatch<React.SetStateAction<string>>;
  closeAllProgress: () => void;
}
const CreateAFlow = ({
  flowsData,
  newProcessName,
  setNewProcessName,
  setCreateNewFlow,
  setSelectedFlowData,
  setSelectedFlowName,
  closeAllProgress,
}: ICreateAFlowProps) => {
  const api = useAxiosPrivate();

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
          const postData = {
            process_id: flowsData.length + 1,
            process_name: newProcessName,
            process_structure: { nodes: [], edges: [] },
          };
          const res = await api.post("/orchestration-studio-process", postData);
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
