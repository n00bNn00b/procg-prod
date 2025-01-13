import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "../ui/switch";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import { IUserLinkedDevices } from "@/types/interfaces/users.interface";
import { useEffect, useState } from "react";
import useUserInfo from "@/hooks/useUserInfo";
import Spinner from "../Spinner/Spinner";
import Desktop from "/icons/device-icon/desktop.svg";
import Laptop from "/icons/device-icon/laptop.svg";
import Mac from "/icons/device-icon/mac.svg";
import Mobile from "/icons/device-icon/android.svg";
import Tablet from "/icons/device-icon/tablet.svg";
import Windows from "/icons/os-icon/windows.svg";
import MacOS from "/icons/os-icon/mac.svg";
import Linux from "/icons/os-icon/linux.svg";
import Android from "/icons/device-icon/android.svg";
import iOS from "/icons/device-icon/iphone.svg";
import Edge from "/icons/browser-icon/edge.svg";
import Chrome from "/icons/browser-icon/chrome.svg";
import Safari from "/icons/browser-icon/safari.svg";
import Firefox from "/icons/browser-icon/mozila.svg";
import Opera from "/icons/browser-icon/opera.svg";
import Undefined from "/icons/undefined.svg";
import App from "../../../public/favicon-black.svg";

const UserLinkedDevices = () => {
  const api = useAxiosPrivate();
  const { token } = useGlobalContext();
  const { inactiveDevice, linkedDevices, setLinkedDevices } =
    useSocketContext();
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useUserInfo();

  useEffect(() => {
    if (!token || token.user_id === 0) return;

    const getDevices = async () => {
      try {
        await userInfo(token.user_id);
        const res = await api.get(`/devices/${token?.user_id}`);
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
        const res = await api.post(
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
    <div className="border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>No</TableHead>
            <TableHead>Device Type</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>Browser Version</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <Spinner size="40" color="black" />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {linkedDevices
                ?.sort((a, b) => b.id - a.id)
                .map((device, i) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      <img
                        src={
                          device.device_type === "Desktop"
                            ? Desktop
                            : device.device_type === "Laptop"
                            ? Laptop
                            : device.device_type === "Mac"
                            ? Mac
                            : device.device_type === "Mobile" ||
                              device.device_type === "Handset"
                            ? Mobile
                            : device.device_type === "Tablet"
                            ? Tablet
                            : Undefined
                        }
                        alt="image"
                        className="w-6"
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={
                          device.os === "Windows"
                            ? Windows
                            : device.os === "MacOS"
                            ? MacOS
                            : device.os === "Linux"
                            ? Linux
                            : device.os === "Android" ||
                              device.os === "Android OS"
                            ? Android
                            : iOS
                        }
                        alt="image"
                        className="w-6"
                      />
                    </TableCell>
                    <TableCell>
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
                            : device.browser_name === "App"
                            ? App
                            : Opera
                        }
                        alt="image"
                        className="w-6"
                      />
                    </TableCell>
                    <TableCell>{device.browser_version}</TableCell>
                    <TableCell>{device.ip_address}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell className="flex flex-row-reverse">
                      <Switch
                        disabled={device.is_active === 0 && true}
                        checked={device.is_active === 1 ? true : false}
                        onCheckedChange={() => {
                          // setIsActive(true);
                          switchFunc(device);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default UserLinkedDevices;
