import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useUserInfo from "@/hooks/useUserInfo";
import { useEffect, useState } from "react";
// import Desktop from "/icons/device-icon/desktop.svg";
// import Laptop from "/icons/device-icon/laptop.svg";
// import Mac from "/icons/device-icon/mac.svg";
// import Mobile from "/icons/device-icon/android.svg";
// import Tablet from "/icons/device-icon/tablet.svg";
import iOS from "/icons/os-icon/mac.svg";
import Windows from "/icons/os-icon/windows.svg";
import MacOS from "/icons/os-icon/mac.svg";
import Linux from "/icons/os-icon/linux.svg";
import Android from "/icons/os-icon/android.svg";
import Edge from "/icons/browser-icon/edge.svg";
import Chrome from "/icons/browser-icon/chrome.svg";
import Safari from "/icons/browser-icon/safari.svg";
import Firefox from "/icons/browser-icon/mozila.svg";
import Opera from "/icons/browser-icon/opera.svg";
import Undefined from "/icons/undefined.svg";
import App from "/favicon-black.svg";
import { Switch } from "@/components/ui/switch";
import { IUserLinkedDevices } from "@/types/interfaces/users.interface";

const YourDevices = () => {
  const api = useAxiosPrivate();
  const { token } = useGlobalContext();
  const { linkedDevices, setLinkedDevices, inactiveDevice } =
    useSocketContext();
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useUserInfo();

  useEffect(() => {
    if (!token || token.user_id === 0) return;

    const getDevices = async () => {
      try {
        await userInfo(token.user_id);
        const res = await api.get(`/devices/${token?.user_id}`);
        console.log(res, "res");
        setLinkedDevices(res.data);
      } catch (error) {
        console.log("error while getting devices");
      } finally {
        setIsLoading(false);
      }
    };

    getDevices();
  }, [api, isLoading, setLinkedDevices]);

  const switchFunc = async (data: IUserLinkedDevices) => {
    try {
      const res = async () => {
        const res = await api.put(
          `/devices/inactive-device/${token.user_id}/${data.id}`,
          {
            ...data,
            is_active: 0,
          }
        );

        if (res.status === 200) {
          inactiveDevice(res.data);
        }
      };

      res();
    } catch (error) {
      console.log("Error while deactivating device");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 bg-[#b4d6f3] p-4">
        <h3 className="font-semibold">Your Devices</h3>
        <p>Your account is logged in from multiple devices.</p>
        <div>
          <p className="w-[239px] text-center bg-white text-red-500 font-semibold p-2 inline-block cursor-pointer">
            Logout from all devices
          </p>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#f5f5f5]">
        <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-250px)]">
          {linkedDevices.map((device) => (
            <div
              key={device.id}
              className="p-4 bg-white flex justify-between items-center"
            >
              <div className="flex gap-2">
                <div>
                  <img
                    src={
                      device.os === "Windows"
                        ? Windows
                        : device.os === "Linux"
                        ? Linux
                        : device.os === "Mac"
                        ? MacOS
                        : device.os === "iOS"
                        ? iOS
                        : device.os === "Android"
                        ? Android
                        : Undefined
                    }
                    alt="image"
                    className="w-6"
                  />
                </div>
                <div>
                  <p className="font-medium">{device.os}</p>
                  <span className=" ">
                    <span>{device.location}</span>
                    <span> - </span>
                    <span className="font-medium">{device.ip_address}</span>
                  </span>
                  <div className="flex gap-1">
                    <img
                      src={
                        device.browser_name === "Microsoft Edge"
                          ? Edge
                          : device.browser_name === "Google Chrome"
                          ? Chrome
                          : device.browser_name === "Apple Safari"
                          ? Safari
                          : device.browser_name === "Mozilla Firefox"
                          ? Firefox
                          : device.browser_name === "Opera"
                          ? Opera
                          : device.browser_name === "App"
                          ? App
                          : Undefined
                      }
                      alt="image"
                      className="w-6"
                    />
                    <p>{device.browser_version}</p>
                  </div>
                </div>
              </div>
              <div>
                <Switch
                  disabled={device.is_active === 0 && true}
                  checked={device.is_active === 1 ? true : false}
                  onCheckedChange={() => {
                    // setIsActive(true);
                    switchFunc(device);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default YourDevices;
