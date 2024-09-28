import { createBrowserRouter } from "react-router-dom";
import Layout from "@/Layout/Layout";
import Profile from "@/pages/Profile/Profile";
import Inbox from "@/pages/Notifications/Inbox";
import Sent from "@/pages/Notifications/Sent";
import Draft from "@/pages/Notifications/Draft";
import SingleMessage from "@/pages/Notifications/SingleMessage";
import SingleDraft from "@/pages/Notifications/SingleDraft";
import Tasks from "@/pages/Tasks/Tasks";
import Home from "@/pages/Home/Home";
import SingleSent from "@/pages/Notifications/SingleSent";
import DataSources from "@/pages/ManageDataSources/DataSources";
import ManageAccessEntitlements from "@/pages/ManageAccessEntitlements/ManageAccessEntitlements";
import SetupAndAdministration from "@/pages/SetupAndAdministration/SetupAndAdministration";
import ManageGlobaConditions from "@/pages/ManageGlobalConditions/ManageGlobalConditions";
import ManageLocalConditions from "@/pages/ManageLocalConditions/ManageLocalConditions";
import ManageAccessModels from "@/pages/ManageAccessModels/ManageAccessModels";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },

      {
        path: "notifications",
        children: [
          {
            path: "inbox",
            element: <Inbox />,
          },
          {
            path: "sent",
            element: <Sent />,
          },
          {
            path: "draft",
            element: <Draft />,
          },
          {
            path: "draft/:id",
            element: <SingleDraft />,
          },
          {
            path: "sent/:id",
            element: <SingleSent />,
          },
          {
            path: "inbox/:id",
            element: <SingleMessage />,
          },
        ],
      },
      {
        path: "tools",
        children: [
          {
            path: "setup-and-administration",
            element: <SetupAndAdministration />,
          },
          {
            path: "datasources",
            element: <DataSources />,
          },
          {
            path: "manage-access-entitlements",
            element: <ManageAccessEntitlements />,
          },
          {
            path: "manage-global-conditions",
            element: <ManageGlobaConditions />,
          },
          {
            path: "manage-local-conditions",
            element: <ManageLocalConditions />,
          },
          {
            path: "manage-access-models",
            element: <ManageAccessModels />,
          },
        ],
      },
    ],
  },
]);

export default routes;

// function Router() {

//   return (

//     <>
//       <Routes>
//         {/* <Route path="/" element={<SignIn/>}/> */}

//         {/* <RequiredAuth>
//             <Route path="/" element={<Layout/>}>
//             <Route path="/profile" element={<Profile/>}/>
//             <Route path="/notifications/inbox" element={<Inbox/>}/>
//             <Route path="/notifications/sent" element={<Sent/>}/>
//             <Route path="/notifications/draft" element={<Draft/>}/>
//             <Route path="/notifications/:id" element={<SingleMessage/>}/>
//             <Route path="/notifications/draft/:id" element={<SingleDraft/>}/>
//             <Route path="/tasks" element={<Tasks/>}/>
//             </Route>
//         </RequiredAuth> */}
//       </Routes>
//     </>
//   );
// }

// export default Router;
