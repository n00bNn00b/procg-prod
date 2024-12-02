import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IUsersInfoTypes } from "@/types/interfaces/users.interface";
import Account from "./Account";
import { useEffect, useState } from "react";

const Profile = () => {
  const { token, getUserInfo } = useGlobalContext();
  const [userInfo, setUserInfo] = useState<IUsersInfoTypes | undefined>();
  useEffect(() => {
    const getUser = async () => {
      const res = await getUserInfo(token?.user_id || 0);
      if (res) {
        setUserInfo(res);
      }
    };
    getUser();
  }, []);
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-[30rem] mx-auto grid-cols-2">
        <TabsTrigger value="profile">Access Profiles</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            {/* <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-2">
            <Avatar>
              <AvatarImage
                className="object-cover object-center w-20 h-20 rounded-full mx-auto border border-8px"
                src="https://github.com/shadcn.png"
              />
            </Avatar>
            <h4 className="font-bold text-center">
              {userInfo?.first_name} {userInfo?.last_name}
            </h4>
            <h4 className="text-center">Job Title : {userInfo?.job_title}</h4>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="customize">
        <Account userInfo={userInfo} />
      </TabsContent>
    </Tabs>
  );
};

export default Profile;
