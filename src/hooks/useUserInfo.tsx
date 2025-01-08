import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useAxiosPrivate from "./useAxiosPrivate";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

const useUserInfo = () => {
  const { presentDevice } = useGlobalContext();
  const { addDevice } = useSocketContext();
  const api = useAxiosPrivate();

  const getIP = async (): Promise<string | null> => {
    try {
      const VITE_API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${VITE_API_URL}/login/get-user-ip-info`);

      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
    }
  };

  const getLocation = async (): Promise<string | null> => {
    try {
      if (!("geolocation" in navigator)) {
        console.log("not allowed");
        console.error("Geolocation is not supported by this browser.");
        return "Unknown (Location off)";
      }
      // console.log("allowed");
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              const location = `${data.address.city}, ${
                data.address.county
              }, ${data.address.country_code.toUpperCase()}`;
              resolve(location);
            } catch (error) {
              console.error("Error fetching location details:", error);
              reject(null);
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error.message);
            resolve("Unknown (Location off)");
          }
        );
      });
    } catch (error) {
      console.error("Unexpected error in getLocation:", error);
      return null;
    }
  };

  const userInfo = async (user_id: number) => {
    try {
      const ipAddress = await getIP();
      const geolocation = await getLocation();
      // console.log(geolocation, "allowed then geolocation");
      const deviceData = {
        ...presentDevice,
        ip_address: ipAddress ? ipAddress : "Unknown",
        location: geolocation ? geolocation : "Unknown (Location off)",
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

  return userInfo;
};

export default useUserInfo;
