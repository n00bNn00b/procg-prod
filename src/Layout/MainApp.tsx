import Breadcurmbs from "@/components/Breadcrumbs/Breadcrumbs";
import Sidbar from "@/components/Sidebar/Sidbar";
import Topbar from "@/components/Topbar/Topbar";
import { Toaster } from "@/components/ui/toaster";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Outlet } from "react-router-dom";

const MainApp = () => {
  const { open } = useGlobalContext();

  return (
    <>
      <div className="font-workSans">
        <Topbar />
        <div className="flex gap-4 pt-[3rem]">
          <Sidbar />
          <div
            className={
              open
                ? "ml-[17.5rem] w-[calc(100vw-16.5rem)] min-h-[calc(100vh-4rem)] duration-1000"
                : "ml-[6rem] w-[calc(100vw-10rem)] min-h-[calc(100vh-4rem)] duration-1000"
            }
          >
            <Breadcurmbs />
            <Outlet />
          </div>
          <Toaster />
        </div>
      </div>
    </>
  );
};

export default MainApp;
