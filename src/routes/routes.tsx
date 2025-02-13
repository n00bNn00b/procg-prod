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
import ManageDataSources from "@/pages/Tools/ManageDataSources/ManageDataSources";
import Users from "@/pages/Tools/SecurityConsole/ManageUsers/SetupAndAdministration";
import ManageGlobaConditions from "@/pages/EnterpriseSecurityControls/ManageGlobalConditions/ManageGlobalConditions";
import ManageLocalConditions from "@/pages/EnterpriseSecurityControls/ManageLocalConditions/ManageLocalConditions";
import Alerts from "@/pages/Alerts/Alerts";
import Error from "@/pages/Error/Error";
import RiskManagement from "@/pages/Finance/RiskManagement/RiskManagement";
import ControlManagement from "@/pages/Finance/ControlManagement/ControlManagement";
import IssueManagement from "@/pages/Finance/IssueManagement/IssueManagement";
import ResultManagement from "@/pages/ContinuousMonitoring/ResultManagement/ResultManagement";
import ContinuousControlManagement from "@/pages/ContinuousMonitoring/ContinuousControlManagement/ContinuousControlManagement";
import ManageControls from "@/pages/EnterpriseSecurityControls/Controls/ManageControls/ManageControls";
import ManageAccessModels from "@/pages/EnterpriseSecurityControls/AccessModels/ManageAccessModels/ManageAccessModels";
import ManageAccessEntitlements from "@/pages/EnterpriseSecurityControls/ManageAccessEntitlements/ManageAccessEntitlements";
import Security from "@/pages/Security/Security";
import Settings from "@/pages/Settings/Settings";
import ManageResults from "@/pages/EnterpriseSecurityControls/Controls/ManageResults/ManageResults";
import RecycleBin from "@/pages/Notifications/RecycleBin";
import SingleRecycleBin from "@/pages/Notifications/SingleRecycleBin";
import SignIn from "@/pages/SignIn/SignIn";
import Layout from "@/Layout/Layout";
import ManageConfigurations from "@/pages/AsynchronousRequestManager/Administration/ManageConfigurations";
import ManageSchedulers from "@/pages/AsynchronousRequestManager/Administration/ManageSchedulers";
import ManageWorkers from "@/pages/AsynchronousRequestManager/Administration/ManageWorkers";
import RegisterEditAsynchronousTasks from "@/pages/AsynchronousRequestManager/Development/RegisterEditAsynchronousTasks/RegisterEditAsynchronousTasks";
import TaskParameters from "@/pages/AsynchronousRequestManager/Development/TaskParameters/TaskParameters";
import ScheduleATask from "@/pages/AsynchronousRequestsAndTaskSchedules/ScheduleATask";
import ViewEditScheduledTasks from "@/pages/AsynchronousRequestsAndTaskSchedules/ViewEditScheduledTasks";
import RunAnAdHocRequest from "@/pages/AsynchronousRequestsAndTaskSchedules/RunAnAdHocRequest";
import ViewRequests from "@/pages/AsynchronousRequestsAndTaskSchedules/ViewRequests";
import EnterpriseSecurityControls from "@/pages/EnterpriseSecurityControls/EnterpriseSecurityControls";
import AccessModels from "@/pages/EnterpriseSecurityControls/AccessModels/AccessModels";
import Controls from "@/pages/EnterpriseSecurityControls/Controls/Controls";
import AsynchronousRequestsAndTaskSchedules from "@/pages/AsynchronousRequestsAndTaskSchedules/AsynchronousRequestsAndTaskSchedules";
import AsynchronousRequestManager from "@/pages/AsynchronousRequestManager/AsynchronousRequestManager";
import Administration from "@/pages/AsynchronousRequestManager/Administration/Administration";
import Development from "@/pages/AsynchronousRequestManager/Development/Development";
import ManageControlEnvironments from "@/pages/EnterpriseSecurityControls/Setup/ManageControlEnvironments/ManageControlEnvironments";
import Setup from "@/pages/EnterpriseSecurityControls/Setup/Setup";
import ManageAccessPoints from "@/pages/EnterpriseSecurityControls/ManageAccessPoints/ManageAccessPoints";
import Tools from "@/pages/Tools/Tools";
import SecurityConsole from "@/pages/Tools/SecurityConsole/SecurityConsole";
import EnterpriseAccessMonitoring from "@/pages/EnterpriseAccessMonitoring/EnterpriseAccessMonitoring";
import PrivilegedAccessReview from "@/pages/EnterpriseAccessMonitoring/PrivilegedAccessReview";
import ServiceAccountsAudit from "@/pages/EnterpriseAccessMonitoring/ServiceAccountsAudit";
import UserAccessVisibility from "@/pages/EnterpriseAccessMonitoring/UserAccessVisibility";
import AuditorReporting from "@/pages/EnterpriseAccessMonitoring/AuditorReporting";
import NotificatonsRoutes from "@/pages/Notifications/NotificatonsRoutes";
import ContinuousMonitoring from "@/pages/ContinuousMonitoring/ContinuousMonitoring";
import Finance from "@/pages/Finance/Finance";
import { ViewEditScheduledTasksTableV1 } from "@/components/AsynchronousRequestsAndTaskSchedules/ViewEditScheduledTasksV1/ViewEditScheduledTasksTableV1";
import ScheduleATaskV1 from "@/pages/AsynchronousRequestsAndTaskSchedules/ScheduleATaskV1";
import ManageExecutionMethods from "@/pages/AsynchronousRequestManager/Development/ManageExecutionMethods/ManageExecutionMethods";

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
            path: "",
            element: <NotificatonsRoutes />,
          },
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
            path: "",
            element: <Finance />,
          },
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
            path: "",
            element: <ContinuousMonitoring />,
          },
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
            path: "",
            element: <Tools />,
          },
          {
            path: "security-console",
            children: [
              {
                path: "",
                element: <SecurityConsole />,
              },
              {
                path: "manage-users",
                element: <Users />,
              },
            ],
          },
          {
            path: "manage-data-sources",
            element: <ManageDataSources />,
          },
        ],
      },
      {
        path: "enterprise-security-controls",
        children: [
          {
            path: "",
            element: <EnterpriseSecurityControls />,
          },

          {
            path: "access-models",
            children: [
              {
                path: "",
                element: <AccessModels />,
              },
              {
                path: "manage-access-models",
                element: <ManageAccessModels />,
              },
            ],
          },
          {
            path: "controls",
            children: [
              {
                path: "",
                element: <Controls />,
              },
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
            path: "setup",
            children: [
              {
                path: "",
                element: <Setup />,
              },
              {
                path: "manage-control-environments",
                element: <ManageControlEnvironments />,
              },
            ],
          },
          {
            path: "manage-access-entitlements",
            element: <ManageAccessEntitlements />,
          },
          {
            path: "manage-access-points",
            element: <ManageAccessPoints />,
          },
          {
            path: "manage-global-conditions",
            element: <ManageGlobaConditions />,
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
            path: "",
            element: <AsynchronousRequestManager />,
          },
          {
            path: "administration",
            children: [
              {
                path: "",
                element: <Administration />,
              },
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
                path: "",
                element: <Development />,
              },
              {
                path: "manage-execution-methods",
                element: <ManageExecutionMethods />,
              },
              {
                path: "register-edit-asynchronous-tasks",
                element: <RegisterEditAsynchronousTasks />,
              },
              {
                path: "manage-task-parameters",
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
            path: "",
            element: <AsynchronousRequestsAndTaskSchedules />,
          },
          {
            path: "schedule-a-task",
            element: <ScheduleATask />,
          },
          {
            path: "v1/schedule-a-task",
            element: <ScheduleATaskV1 />,
          },
          {
            path: "view-edit-scheduled-tasks",
            element: <ViewEditScheduledTasks />,
          },

          {
            path: "v1/view-edit-scheduled-tasks",
            element: <ViewEditScheduledTasksTableV1 />,
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
      {
        path: "enterprise-access-monitoring",
        children: [
          {
            path: "",
            element: <EnterpriseAccessMonitoring />,
          },
          {
            path: "privileged-access-review",
            element: <PrivilegedAccessReview />,
          },

          {
            path: "service-accounts-audit",
            element: <ServiceAccountsAudit />,
          },
          {
            path: "user-access-visibility",
            element: <UserAccessVisibility />,
          },
          {
            path: "auditor-reporting",
            element: <AuditorReporting />,
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
