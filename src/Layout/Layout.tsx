import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import MainApp from "./MainApp";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";

const Layout = () => {
  const { token, isUserLoading } = useGlobalContext();
  const location = useLocation();

  if (isUserLoading) {
    return (
      <div className="text-center p-4">
        <Spinner size="100" color="red"></Spinner>
      </div>
    );
  }

  if (token?.user_id === 0) {
    return <Navigate state={location.pathname} to="/login" replace />;
  }

  return <>{token?.user_id !== 0 && <MainApp />}</>;
};

export default Layout;
