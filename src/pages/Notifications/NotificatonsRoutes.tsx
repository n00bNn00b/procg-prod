import { Link } from "react-router-dom";

const NotificatonsRoutes = () => {
  const paths = [
    {
      name: "Inbox",
      path: "/notifications/inbox",
    },
    {
      name: "Sent",
      path: "/notifications/sent",
    },
    {
      name: "Drafts",
      path: "/notifications/drafts",
    },
    {
      name: "Recycle Bin",
      path: "/notifications/recycle-bin",
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {paths.map((path) => (
        <Link to={path.path} className="text-blue-600 hover:underline">
          <h3>{path.name}</h3>
        </Link>
      ))}
    </div>
  );
};
export default NotificatonsRoutes;
