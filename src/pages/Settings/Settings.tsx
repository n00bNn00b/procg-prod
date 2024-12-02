import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  const url = import.meta.env.VITE_API_URL;
  return (
    <div>
      {/* <h1 className="">Settings</h1> */}
      <Card>
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
    </div>
  );
};
export default Settings;
