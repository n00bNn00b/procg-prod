import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangePassword from "./ChangePassword";
import UserLinkedDevices from "@/components/LinkedDevices/UserLinkedDevices";
import LinkDevices from "./LinkDevices";

export default function Security() {
  return (
    <Tabs defaultValue="change_password" className="w-full">
      <div className="bg-slate-100 rounded">
        <TabsList className="grid w-[40rem] grid-cols-3">
          <TabsTrigger value="change_password">Change Password</TabsTrigger>
          <TabsTrigger value="link-devices">Link a Device</TabsTrigger>
          <TabsTrigger value="linked-devices">Linked Devices</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="change_password">
        <ChangePassword />
      </TabsContent>
      <TabsContent value="link-devices">
        <LinkDevices />
      </TabsContent>
      <TabsContent value="linked-devices">
        <UserLinkedDevices />
      </TabsContent>
    </Tabs>
  );
}
