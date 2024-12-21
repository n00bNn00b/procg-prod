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
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api(prevRequest);
          } catch (err) {
            return Promise.reject(err); // Handle errors from the refresh function
          }
        }
        return Promise.reject(error);
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
