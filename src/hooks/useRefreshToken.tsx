import { api } from "@/Api/Api";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
// import { Navigate } from "react-router-dom";

const useRefreshToken = () => {
  const { setToken } = useGlobalContext();
  const refreshToken = async () => {
    try {
      const res = await api.get(`/login/refresh-token`);
      // console.log(res,"res")
      setToken((prev) => {
        console.log(JSON.stringify(prev));
        return { ...prev, access_token: res.data.access_token };
      });
      return res.data.access_token;
    } catch (error) {
      // Handle refresh token error or redirect to login
      console.log(error);
      // <Navigate to="/login" />;
    }
  };
  return refreshToken;
};
export default useRefreshToken;
