import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import SignIn from "@/pages/SignIn/SignIn";
import MainApp from "./MainApp";

const Layout = () => {
  const { token } = useGlobalContext();
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
        <MainApp/>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Layout;
