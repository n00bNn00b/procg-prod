import { ViewEditScheduledTasksTable } from "@/components/AsynchronousRequestsAndTaskSchedules/ViewEditScheduledTasks/ViewEditScheduledTasksTable";

const ViewEditScheduledTasks = () => {
  return (
    <div>
      <ViewEditScheduledTasksTable limit={10} action="Edit Task Schedule" />
    </div>
  );
};
export default ViewEditScheduledTasks;
