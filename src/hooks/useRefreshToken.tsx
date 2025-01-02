import { api } from "@/Api/Api";
import { toast } from "@/components/ui/use-toast";
import {
  useGlobalContext,
  userExample,
} from "@/Context/GlobalContext/GlobalContext";

const useRefreshToken = () => {
  const { setToken } = useGlobalContext();

  const refreshToken = async () => {
    try {
      const response = await api.get(`/login/refresh-token`);
      if (!response) {
        await api.get(`/logout`);

        toast({
          title: "Session Expired",
          description: "Please login again",
        });
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
