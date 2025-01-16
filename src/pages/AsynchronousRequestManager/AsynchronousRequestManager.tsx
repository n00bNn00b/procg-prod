import { Link } from "react-router-dom";

const AsynchronousRequestManager = () => {
  const paths = [
    {
      name: "Development",
      path: "/asynchronous-request-manager/development",
    },
    {
      name: "Administration",
      path: "/asynchronous-request-manager/administration",
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
export default AsynchronousRequestManager;
