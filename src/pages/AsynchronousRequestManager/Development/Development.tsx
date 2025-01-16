import { Link } from "react-router-dom";

const Development = () => {
  const paths = [
    {
      name: "Register Tasks",
      path: "/asynchronous-request-manager/development/register-tasks",
    },
    {
      name: "Task Parameters",
      path: "/asynchronous-request-manager/development/task-parameters",
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
export default Development;
