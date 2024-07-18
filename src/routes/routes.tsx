import Alerts from "@/pages/Alerts/Alerts";
import Home from "@/pages/Home/Home";
import Notifications from "@/pages/Notifications/Notifications";
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
    ],
  },
]);

export default routes;
