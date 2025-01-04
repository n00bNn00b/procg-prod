import UserLinkedDevices from "@/components/LinkedDevices/UserLinkedDevices";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const LinkedDevies = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Devices</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <UserLinkedDevices />
      </CardContent>
      <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
    </Card>
  );
};
export default LinkedDevies;
