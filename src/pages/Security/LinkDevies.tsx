import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";
const LinkDevies = () => {
  return (
    <Card className="h-[70vh]">
      <CardHeader>
        <CardTitle>Link a Device</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="mt-auto">
          <QRCodeCanvas
            value="shdfksldfnsdflksdf.sdfnsdflndsf"
            title={"Link Account"}
            size={200}
          />
        </div>
      </CardContent>
      <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
    </Card>
  );
};
export default LinkDevies;
