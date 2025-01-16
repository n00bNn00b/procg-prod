import { Link } from "react-router-dom";

const Controls = () => {
  const paths = [
    {
      name: "Manage Controls",
      path: "/enterprise-security-controls/controls/manage-controls",
    },
    {
      name: "Manage Results",
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
export default Controls;
