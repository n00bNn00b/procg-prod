import { api } from "@/Api/Api";
import { toast } from "@/components/ui/use-toast";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const useRefreshToken = () => {
  const { setToken } = useGlobalContext();
  const userExample = {
    isLoggedIn: false,
    user_id: 0,
    user_name: "",
    user_type: "",
    tenant_id: 0,
    access_token: "",
    issuedAt: "",
    iat: 0,
    exp: 0,
  };

  const refreshToken = async () => {
    try {
      const isLoggedIn = localStorage.getItem("loggedInUser");
      const response = await api.get(`/login/refresh-token`);
      if (!response && isLoggedIn === "true") {
        await api.get(`/logout`);

        toast({
          title: "Session Expired",
          description: "Please login again",
        });
        localStorage.removeItem("loggedInUser");
        setToken(userExample);
        // setTimeout(() => {
        //   window.location.href = "/login";
        // }, 2000);
        return;
      }
      setToken(response.data);
      return response.data.access_token;
    } catch (error) {
      console.log(error, "Refresh token invalid or expired.");
      return;
    }
  };
  return refreshToken;
};
export default useRefreshToken;
