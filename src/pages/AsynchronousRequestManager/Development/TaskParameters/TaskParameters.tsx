import { TaskParametersTable } from "@/components/ARM/TaskParameters/TaskParametersTable";
import { TopTable } from "@/components/ARM/TaskParameters/TopTasksTable";

const TaskParameters = () => {
  return (
    <div>
      <TopTable />
      <TaskParametersTable />
    </div>
  );
};
export default TaskParameters;
