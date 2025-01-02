import LinkDevices from "@/components/LinkedDevices/LinkDevices";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const LinkedDevies = () => {
  return (
    <Card className="h-[70vh]">
      <CardHeader>
        <CardTitle>Linked Devices</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <LinkDevices />
      </CardContent>
      <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
    </Card>
  );
};
export default LinkedDevies;
