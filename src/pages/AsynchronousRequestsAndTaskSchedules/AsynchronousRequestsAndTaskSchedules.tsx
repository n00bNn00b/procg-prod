import { Link } from "react-router-dom";

const AsynchronousRequestsAndTaskSchedules = () => {
  const paths = [
    {
      name: "Schedule A Task",
      path: "/asynchronous-requests-and-task-schedules/schedule-a-task",
    },
    {
      name: "View/Edit Scheduled Tasks",
      path: "/asynchronous-requests-and-task-schedules/view-edit-scheduled-tasks",
    },
    {
      name: "Run an ad-hoc Request",
      path: "/asynchronous-requests-and-task-schedules/run-an-ad-hoc-request",
    },
    {
      name: "View Requests",
      path: "/asynchronous-requests-and-task-schedules/view-requests",
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {paths.map((path) => (
        <Link to={path.path} className="text-blue-600">
          <h3>{path.name}</h3>
        </Link>
      ))}
    </div>
  );
};
export default AsynchronousRequestsAndTaskSchedules;
