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

const UserLinkedDevices = () => {
  const api = useAxiosPrivate();
  const { token } = useGlobalContext();
  const { inactiveDevice, linkedDevices, setLinkedDevices } =
    useSocketContext();
  const [isLoading, setIsLoading] = useState(true);
  // const [isActive, setIsActive] = useState<boolean>(false);
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
  }, [isLoading]);

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
      // setIsActive(false);
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
            <TableHead>Browser Name</TableHead>
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
              {linkedDevices?.map((device, i) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell className="font-medium">
                    {device.device_type}
                  </TableCell>
                  <TableCell>{device.os}</TableCell>
                  <TableCell>{device.browser_name}</TableCell>
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
