import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import MainApp from "./MainApp";
import { Navigate, useLocation } from "react-router-dom";

const Layout = () => {
  const { token } = useGlobalContext();
  const location = useLocation();

  if (!token?.access_token) {
    return <Navigate state={location.pathname} to="/login" replace />;
  }

  return <>{token?.access_token && <MainApp />}</>;
};

export default Layout;
