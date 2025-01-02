import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import MainApp from "./MainApp";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

const Layout = () => {
  const { token, isUserLoading, presentDevice } = useGlobalContext();
  const { addDevice } = useSocketContext();
  const location = useLocation();
  const api = useAxiosPrivate();

  //Add device
  useEffect(() => {
    const addUserDevice = async (user_id: number) => {
      try {
        if (!token || token.user_id === 0) return;
        await api
          .post("/devices/add-device", {
            user_id,
            deviceInfo: { ...presentDevice, is_active: 1 },
          })
          .then((res) => {
            addDevice(res.data);
          });
      } catch (error) {
        console.log("Adding device error");
      }
    };

    addUserDevice(token.user_id);
  }, [token?.user_id]);

  if (isUserLoading) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <Spinner size="100" color="red"></Spinner>
      </div>
    );
  }

  if (
    token?.user_id === 0 &&
    token.access_token === "" &&
    token.isLoggedIn === false &&
    token.issuedAt === ""
  ) {
    return <Navigate state={location.pathname} to="/login" replace />;
  }

  return <MainApp />;
};

export default Layout;
