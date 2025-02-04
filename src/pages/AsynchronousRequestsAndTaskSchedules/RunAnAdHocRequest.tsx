import TaskRequest from "@/components/AsynchronousRequestsAndTaskSchedules/TaskRequest/TaskRequest";

const RunAnAdHocRequest = () => {
  return (
    <div>
      <TaskRequest
        user_schedule_name="Ad Hoc"
        action="Ad Hoc"
        handleCloseModal={() => {}}
      />
    </div>
  );
};
export default RunAnAdHocRequest;
