import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangePassword from "./ChangePassword";
import LinkDevies from "./LinkDevies";
import LinkedDevices from "./LinkedDevices";

export default function Security() {
  return (
    <Tabs defaultValue="change_password" className="w-full">
      <TabsList className="grid w-[40rem] grid-cols-3">
        <TabsTrigger value="change_password">Change Password</TabsTrigger>
        <TabsTrigger value="link-devices">Link a Device</TabsTrigger>
        <TabsTrigger value="linked-devices">Linked Devices</TabsTrigger>
      </TabsList>
      <TabsContent value="change_password">
        <ChangePassword />
      </TabsContent>
      <TabsContent value="link-devices">
        <LinkDevies />
      </TabsContent>
      <TabsContent value="linked-devices">
        <LinkedDevices />
      </TabsContent>
    </Tabs>
  );
}
