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
import DataSources from "@/pages/Tools/ManageDataSources/DataSources";
import Users from "@/pages/Tools/Users/SetupAndAdministration";
import ManageGlobaConditions from "@/pages/ManageAdministration/ManageGlobalConditions/ManageGlobalConditions";
import ManageLocalConditions from "@/pages/ManageAdministration/ManageLocalConditions/ManageLocalConditions";
import Alerts from "@/pages/Alerts/Alerts";
import Error from "@/pages/Error/Error";
import RiskManagement from "@/pages/Finance/RiskManagement/RiskManagement";
import ControlManagement from "@/pages/Finance/ControlManagement/ControlManagement";
import IssueManagement from "@/pages/Finance/IssueManagement/IssueManagement";
import ResultManagement from "@/pages/ContinuousMonitoring/ResultManagement/ResultManagement";
import ContinuousControlManagement from "@/pages/ContinuousMonitoring/ContinuousControlManagement/ContinuousControlManagement";
import ManageControls from "@/pages/Controls/ManageControls/ManageControls";
import CreateAccessModels from "@/pages/AccessModels/CreateAccessModels/CreateAccessModels";
import CreateAccessGlobalConditions from "@/pages/ManageAdministration/CreateAccessGlobalConditions/CreateAccessGlobalConditions";
import ManageAccessPathConditions from "@/pages/ManageAdministration/ManageAccessPathConditions/ManageAccessPathConditions";
import ManageUserDefinedObjects from "@/pages/ManageAdministration/ManageUserDefinedObjects/ManageUserDefinedObjects";
import ManageCCMJobs from "@/pages/ManageAdministration/ManageCCMJobs/ManageCCMJobs";
import ManageAccessModels from "@/pages/AccessModels/ManageAccessModels/ManageAccessModels";
import ManageAccessEntitlements from "@/pages/ManageAdministration/ManageAccessEntitlements/ManageAccessEntitlements";
import Security from "@/pages/Security/Security";
import Settings from "@/pages/Settings/Settings";
import ManageResults from "@/pages/Controls/ManageResults/ManageResults";

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
        path: "alerts",
        element: <Alerts />,
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
        path: "security",
        element: <Security />,
      },
      {
        path: "settings",
        element: <Settings />,
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
        path: "finance",
        children: [
          {
            path: "risk-management",
            element: <RiskManagement />,
          },
          {
            path: "control-management",
            element: <ControlManagement />,
          },
          {
            path: "issue-management",
            element: <IssueManagement />,
          },
        ],
      },
      {
        path: "continuous-monitoring",
        children: [
          {
            path: "continuous-control-management",
            element: <ContinuousControlManagement />,
          },
          {
            path: "result-management",
            element: <ResultManagement />,
          },
        ],
      },
      {
        path: "tools",
        children: [
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "datasources",
            element: <DataSources />,
          },
        ],
      },
      {
        path: "controls",
        children: [
          {
            path: "manage-controls",
            element: <ManageControls />,
          },
          {
            path: "manage-results",
            element: <ManageResults />,
          },
        ],
      },
      {
        path: "access-models",
        children: [
          {
            path: "manage-access-models",
            element: <ManageAccessModels />,
          },
          {
            path: "create-access-model",
            element: <CreateAccessModels />,
          },
        ],
      },
      {
        path: "manage-administration",
        children: [
          {
            path: "manage-access-entitlements",
            element: <ManageAccessEntitlements />,
          },
          {
            path: "manage-access-global-conditions",
            element: <ManageGlobaConditions />,
          },
          {
            path: "create-access-global-conditions",
            element: <CreateAccessGlobalConditions />,
          },
          {
            path: "manage-access-path-conditions",
            element: <ManageAccessPathConditions />,
          },
          {
            path: "manage-user-defined-objects",
            element: <ManageUserDefinedObjects />,
          },
          {
            path: "manage-ccm-jobs",
            element: <ManageCCMJobs />,
          },
          {
            path: "manage-local-conditions",
            element: <ManageLocalConditions />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
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
