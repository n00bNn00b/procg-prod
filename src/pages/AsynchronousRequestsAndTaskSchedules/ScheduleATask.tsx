import { ViewEditScheduledTasksTable } from "@/components/AsynchronousRequestsAndTaskSchedules/ViewEditScheduledTasks/ViewEditScheduledTasksTable";

const ScheduleATask = () => {
  return (
    <div>
      <div>
        <ViewEditScheduledTasksTable limit={4} action="Schedule A Task" />
      </div>
    </div>
  );
};
export default ScheduleATask;
