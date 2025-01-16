import { Link } from "react-router-dom";

const AccessModels = () => {
  const paths = [
    {
      name: "Manage Access Models",
      path: "/enterprise-security-controls/access-models/manage-access-models",
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
export default AccessModels;
