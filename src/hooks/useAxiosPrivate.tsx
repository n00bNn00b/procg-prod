import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
import { api } from "@/Api/Api";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { token } = useGlobalContext();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token?.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const prevRequest = error?.config;
          if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api(prevRequest);
          }
        } catch (error) {
          console.log(error, "axios private error");
          return;
        }
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refresh]);

  return api;
};

export default useAxiosPrivate;
