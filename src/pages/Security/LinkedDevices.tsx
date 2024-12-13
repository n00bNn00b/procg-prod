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
      <CardContent>Linked devices</CardContent>
      <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
    </Card>
  );
};
export default LinkedDevies;
