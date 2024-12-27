import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const Account = () => {
  const { combinedUser: userInfo } = useGlobalContext();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Make changes to your account here. Click save when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Avatar</Label>
            <Input type="file" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" defaultValue={userInfo?.first_name} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="last-name"> Last Name</Label>
            <Input id="last-name" defaultValue={userInfo?.last_name} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue={userInfo?.user_name} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={userInfo?.email_addresses[0]} />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Account;
