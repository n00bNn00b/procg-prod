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

const routes = createBrowserRouter([
    {
        path: "/",
        element:<Layout/>,
        children: 
        [
            {
                path: "home",
                element: <Home/>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "tasks",
                element: <Tasks/>
            },

            {
                path: "notifications",
                children: 
                [
                    {
                        path: "inbox",
                        element: <Inbox/>,
                    },
                    {
                        path: "sent",
                        element: <Sent/>,
                    },
                    {
                        path: "draft",
                        element: <Draft/>,
                    },
                    {
                        path: "draft/:id",
                        element: <SingleDraft/>,
                    },
                    {
                        path: ":id",
                        element: <SingleMessage/>,
                    },
                ]
            }
        ]
    },
    
])

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
