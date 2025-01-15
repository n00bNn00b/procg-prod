import { createBrowserRouter } from "react-router-dom";
import Profile from "@/pages/Profile/Profile";
import Inbox from "@/pages/Notifications/Inbox";
import Sent from "@/pages/Notifications/Sent";
import Drafts from "@/pages/Notifications/Drafts";
import SingleMessage from "@/pages/Notifications/SingleMessage";
import SingleDraft from "@/pages/Notifications/SingleDraft";
import ActionItems from "@/pages/ActionItems/ActionItems";
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
import CreateAccessGlobalConditions from "@/pages/ManageAdministration/CreateAccessGlobalConditions/CreateAccessGlobalConditions";
import ManageAccessPathConditions from "@/pages/ManageAdministration/ManageAccessPathConditions/ManageAccessPathConditions";
import ManageUserDefinedObjects from "@/pages/ManageAdministration/ManageUserDefinedObjects/ManageUserDefinedObjects";
import ManageCCMJobs from "@/pages/ManageAdministration/ManageCCMJobs/ManageCCMJobs";
import ManageAccessModels from "@/pages/AccessModels/ManageAccessModels/ManageAccessModels";
import ManageAccessEntitlements from "@/pages/ManageAdministration/ManageAccessEntitlements/ManageAccessEntitlements";
import Security from "@/pages/Security/Security";
import Settings from "@/pages/Settings/Settings";
import ManageResults from "@/pages/Controls/ManageResults/ManageResults";
import RecycleBin from "@/pages/Notifications/RecycleBin";
import SingleRecycleBin from "@/pages/Notifications/SingleRecycleBin";
import SignIn from "@/pages/SignIn/SignIn";
import Layout from "@/Layout/Layout";
import ManageConfigurations from "@/pages/AsynchronousRequestManager/Administration/ManageConfigurations";
import ManageSchedulers from "@/pages/AsynchronousRequestManager/Administration/ManageSchedulers";
import ManageWorkers from "@/pages/AsynchronousRequestManager/Administration/ManageWorkers";
import RegisterEditAsynchronousTasks from "@/pages/AsynchronousRequestManager/Development/RegisterEditAsynchronousTasks";
import TaskParameters from "@/pages/AsynchronousRequestManager/Development/TaskParameters";
import ScheduleATask from "@/pages/AsynchronousRequestsAndTaskSchedules/ScheduleATask";
import ViewEditScheduledTasks from "@/pages/AsynchronousRequestsAndTaskSchedules/ViewEditScheduledTasks";
import RunAnAdHocRequest from "@/pages/AsynchronousRequestsAndTaskSchedules/RunAnAdHocRequest";
import ViewRequests from "@/pages/AsynchronousRequestsAndTaskSchedules/ViewRequests";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      {
        path: "access-profiles",
        element: <Profile />,
      },
      {
        path: "action-items",
        element: <ActionItems />,
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
            path: "drafts",
            element: <Drafts />,
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
          {
            path: "recycle-bin",
            element: <RecycleBin />,
          },
          {
            path: "recycle-bin/:id",
            element: <SingleRecycleBin />,
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
      {
        path: "asynchronous-request-manager",
        children: [
          {
            path: "administration",
            children: [
              {
                path: "manage-configurations",
                element: <ManageConfigurations />,
              },
              {
                path: "manage-schedulers",
                element: <ManageSchedulers />,
              },
              {
                path: "manage-workers",
                element: <ManageWorkers />,
              },
            ],
          },
          {
            path: "development",
            children: [
              {
                path: "register-tasks",
                element: <RegisterEditAsynchronousTasks />,
              },
              {
                path: "task-parameters",
                element: <TaskParameters />,
              },
            ],
          },
        ],
      },
      {
        path: "asynchronous-requests-and-task-schedules",
        children: [
          {
            path: "schedule-a-task",
            element: <ScheduleATask />,
          },
          {
            path: "view-edit-scheduled-tasks",
            element: <ViewEditScheduledTasks />,
          },
          {
            path: "run-an-ad-hoc-request",
            element: <RunAnAdHocRequest />,
          },
          {
            path: "view-requests",
            element: <ViewRequests />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <SignIn />,
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
