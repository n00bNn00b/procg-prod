import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Settings = () => {
  const url = import.meta.env.VITE_API_URL;
  return (
    <Tabs defaultValue="url_link" className="w-full">
      <div className="bg-slate-100 rounded">
        <TabsList className="grid w-[40rem] grid-cols-3">
          <TabsTrigger value="url_link">URL Link</TabsTrigger>
          <TabsTrigger value="link-devic ">Settings</TabsTrigger>
          <TabsTrigger value="linked-device ">Others</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="url_link">
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle>URL Link</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div>
              <div className="mt-auto">
                <QRCodeCanvas
                  value={JSON.stringify(url)}
                  title={"Link Account"}
                  size={200}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="link-devic ">
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle> </CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="linked-device ">
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle> </CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
export default Settings;
