import TaskRequest from "@/components/AsynchronousRequestsAndTaskSchedules/TaskRequest/TaskRequest";

const ScheduleATask = () => {
  return (
    <div>
      <TaskRequest
        action="Schedule A Task"
        user_schedule_name="run_script"
        handleCloseModal={() => {}}
      />
    </div>
  );
};
export default ScheduleATask;
