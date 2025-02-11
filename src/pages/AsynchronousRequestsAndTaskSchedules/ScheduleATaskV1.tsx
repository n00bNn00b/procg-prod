import TaskRequestV1 from "@/components/AsynchronousRequestsAndTaskSchedules/TaskRequestV1/TaskRequestV1";

const ScheduleATaskV1 = () => {
  return (
    <div>
      <TaskRequestV1
        action="Schedule A Task"
        user_schedule_name="run_script"
        handleCloseModal={() => {}}
      />
    </div>
  );
};
export default ScheduleATaskV1;
