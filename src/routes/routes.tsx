import Alerts from "@/pages/Alerts/Alerts";
import Home from "@/pages/Home/Home";
import Notifications from "@/pages/Notifications/Notifications";
import Profile from "@/pages/Profile/Profile";
import Security from "@/pages/Security/Security";
import Settings from "@/pages/Settings/Settings";
import Tasks from "@/pages/Tasks/Tasks";
import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/alerts", element: <Alerts /> },
      { path: "/tasks", element: <Tasks /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/profile", element: <Profile /> },
      { path: "/security", element: <Security /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

export default routes;
