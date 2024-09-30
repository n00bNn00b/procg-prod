import Sidbar from "@/components/Sidebar/Sidbar";
import Topbar from "@/components/Topbar/Topbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import SignIn from "@/pages/SignIn/SignIn";

import Breadcurmbs from "@/components/Breadcrumbs/Breadcrumbs";

const Layout = () => {
  const { open, token } = useGlobalContext();
  // const getToken = (key: string) => {
  //   const value = localStorage.getItem(key);
  //   return value ? JSON.parse(value) : null;
  // };

  // useEffect(() => {
  //   const localToken = getToken("token");
  //   setToken(localToken);
  // }, [setToken]);
  return (
    <>
      {token?.access_token ? (
        <div className="font-hind">
          <Topbar />
          <div className="flex gap-4 pt-[3rem]">
            <Sidbar />
            <div
              className={
                open
                  ? "ml-[16.5rem] w-[calc(100vw-16.5rem)] min-h-[calc(100vh-4rem)] duration-1000"
                  : "ml-24 duration-1000 min-h-[calc(100vh-4rem)] w-[calc(100vw-6rem)]"
              }
            >
              <Breadcurmbs />
              <Outlet />
            </div>
            <Toaster />
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Layout;
