import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import MainApp from "./MainApp";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";

const Layout = () => {
  const { token, isUserLoading } = useGlobalContext();
  const location = useLocation();

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
