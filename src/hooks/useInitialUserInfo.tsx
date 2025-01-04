import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useUserIP from "./useUserIP";
import useAxiosPrivate from "./useAxiosPrivate";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

const useInitialUserInfo = () => {
  const getUserIP = useUserIP();
  const api = useAxiosPrivate();
  const { presentDevice } = useGlobalContext();
  const { addDevice } = useSocketContext();
  const initialUserInfo = async (user_id: number) => {
    try {
      const ipAddress = await getUserIP();
      const deviceData = {
        ...presentDevice,
        ip_address: ipAddress ? ipAddress : "Unknown",
        location: "Unknown",
      };

      const response = await api.post("/devices/add-device", {
        user_id,
        deviceInfo: deviceData,
      });

      addDevice(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return initialUserInfo;
};
export default useInitialUserInfo;
