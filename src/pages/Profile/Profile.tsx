import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IUsersInfoTypes } from "@/types/interfaces/users.interface";
import Account from "./Account";
import { useEffect, useState } from "react";
interface IAccessProfiles {
  user_name?: string;
  email?: string;
  email_1?: string;
  email_2?: string;
  email_3?: string;
  email_4?: string;
  phone_1?: string;
  phone_2?: string;
  phone_3?: string;
}
const Profile = () => {
  const { token, getUserInfo } = useGlobalContext();
  const [userInfo, setUserInfo] = useState<IUsersInfoTypes | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [accessProfiles, setAccessProfiles] = useState<IAccessProfiles>({});
  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const res = await getUserInfo(token?.user_id || 0);

        if (res) {
          const accessProfiles: IAccessProfiles = {};
          accessProfiles.user_name = res.user_name;
          for (let i = 0; i < res?.email_addresses.length; i++) {
            accessProfiles[`email_${i + 1}` as keyof IAccessProfiles] =
              res.email_addresses[i];
          }

          setUserInfo(res);
          setAccessProfiles(accessProfiles);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-[30rem] grid-cols-2">
        <TabsTrigger value="profile">Access Profiles</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card className="h-[70vh]">
          <CardHeader>
            {/* <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center">Loading</div>
            ) : (
              <div className="flex gap-10 justify-center">
                <div className="flex flex-col items-center justify-center border p-4 rounded">
                  <Avatar>
                    <AvatarImage
                      className="object-cover object-center w-20 h-20 rounded-full mx-auto border border-8px"
                      src="https://github.com/shadcn.png"
                    />
                  </Avatar>
                  <h4 className="font-bold text-center">
                    {userInfo?.first_name} {userInfo?.last_name}
                  </h4>
                  <h4 className="text-center">
                    Job Title : {userInfo?.job_title}
                  </h4>
                </div>
                <div className="p-4 flex flex-col">
                  <h1 className="font-bold ">Access Profiles</h1>
                  <QRCodeCanvas
                    value={JSON.stringify(accessProfiles)}
                    title={"Access Profiles"}
                    size={120}
                  />
                </div>
              </div>
            )}
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
