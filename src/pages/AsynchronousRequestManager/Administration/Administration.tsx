import { Link } from "react-router-dom";

const Administration = () => {
  const paths = [
    {
      name: "Manage Configurations",
      path: "/asynchronous-request-manager/administration/manage-configurations",
    },
    {
      name: "Manage Schedulers",
      path: "/asynchronous-request-manager/administration/manage-schedulers",
    },
    {
      name: "Manage Workers",
      path: "/asynchronous-request-manager/administration/manage-workers",
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
export default Administration;
