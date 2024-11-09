import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { IUsersInfoTypes } from "@/types/interfaces/users.interface";
import { useEffect, useState } from "react";
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
const Account = () => {
  const { token, getUserInfo } = useGlobalContext();
  const [userInfo, setUserInfo] = useState<IUsersInfoTypes | undefined>();
  useEffect(() => {
    const getUser = async () => {
      const res = await getUserInfo(token?.user_id ?? 0);
      if (res) {
        setUserInfo(res);
      }
    };
    getUser();
  }, []);
  console.log(userInfo, "userInfo");
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
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Pedro Duarte" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@peduarte" />
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
