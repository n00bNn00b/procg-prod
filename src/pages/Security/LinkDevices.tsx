import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { QRCodeCanvas } from "qrcode.react";
const LinkDevices = () => {
  const { token } = useGlobalContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link a Device</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="mt-auto">
          <QRCodeCanvas
            value={JSON.stringify(token.access_token)}
            title={"Link Account"}
            size={200}
          />
        </div>
      </CardContent>
      <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
    </Card>
  );
};
export default LinkDevices;
