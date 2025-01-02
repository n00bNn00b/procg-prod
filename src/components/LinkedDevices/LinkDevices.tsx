import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
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

const LinkDevices = () => {
  const { token } = useGlobalContext();
  const { inactiveDevice, linkedDevices } = useSocketContext();
  const api = useAxiosPrivate();
  const [isActive, setIsActive] = useState<boolean>(false);

  const switchFunc = async (data: IUserLinkedDevices) => {
    try {
      const res = async () => {
        const res = await api.post(
          `/devices/inactive-device/${token.user_id}/${data.id}`,
          {
            ...data,
            is_active: data.is_active === 1 ? 0 : 1,
          }
        );

        if (res.status === 200) {
          inactiveDevice(res.data);
        }
      };

      res();
    } catch (error) {
      console.log(error);
      setIsActive(false);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>No</TableHead>
            <TableHead>Device Type</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>Browser Name</TableHead>
            <TableHead>Browser Version</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linkedDevices?.map((device, i) => (
            <TableRow key={device.id}>
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell className="font-medium">
                {device.device_type}
              </TableCell>
              <TableCell>{device.os}</TableCell>
              <TableCell>{device.browser_name}</TableCell>
              <TableCell>{device.browser_version}</TableCell>
              <TableCell className="flex flex-row-reverse">
                <Switch
                  checked={device.is_active === 1 ? true : false}
                  onCheckedChange={() => {
                    setIsActive(!isActive);
                    switchFunc(device);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default LinkDevices;
