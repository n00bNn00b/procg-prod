import { Link } from "react-router-dom";

const EnterpriseSecurityControls = () => {
  const paths = [
    {
      name: "Controls",
      path: "/enterprise-security-controls/controls",
    },
    {
      name: "Access Models",
      path: "/enterprise-security-controls/access-models",
    },
    {
      name: "Manage Access Entitlements",
      path: "/enterprise-security-controls/manage-access-entitlements",
    },
    {
      name: "Manage Access Global Conditions",
      path: "/enterprise-security-controls/manage-access-global-conditions",
    },
    {
      name: "Create Access Global Conditions",
      path: "/enterprise-security-controls/create-access-global-conditions",
    },
    {
      name: "Manage Access Path Conditions",
      path: "/enterprise-security-controls/manage-access-path-conditions",
    },
    {
      name: "Manage User Defined Objects",
      path: "/enterprise-security-controls/manage-user-defined-objects",
    },
    {
      name: "Manage Local Conditions",
      path: "/enterprise-security-controls/manage-local-conditions",
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
export default EnterpriseSecurityControls;
