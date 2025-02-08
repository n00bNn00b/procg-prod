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
import { useEffect, useState } from "react";
import UpdateProfile from "./UpdateProfile";
import { AvatarFallback } from "@/components/ui/avatar";

// interface IAccessProfiles {
//   user_name?: string;
//   email?: string;
//   email_1?: string;
//   email_2?: string;
//   email_3?: string;
//   email_4?: string;
//   phone_1?: string;
//   phone_2?: string;
//   phone_3?: string;
// }
const Profile = () => {
  const { token, combinedUser } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  // const [accessProfiles, setAccessProfiles] = useState<IAccessProfiles>({});
  const [accessProfiles, setAccessProfiles] = useState<string>();
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(combinedUser);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!token) return;
        setIsLoading(true);
        if (combinedUser) {
          // for {"user_name":"example_user_name","email_1":"example@gmail.com","email_2":"example2nd@gmail.com"}
          // const accessProfiles: IAccessProfiles = {};
          // accessProfiles.user_name = combinedUser?.user_name;
          // for (let i = 0; i < combinedUser?.email_addresses.length; i++) {
          //   accessProfiles[`email_${i + 1}` as keyof IAccessProfiles] =
          //     combinedUser.email_addresses[i];
          // }
          // setAccessProfiles(accessProfiles);
          setAccessProfiles(combinedUser?.email_addresses.toString());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [combinedUser, token]);
  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="bg-slate-100 rounded">
        <TabsList className="grid w-[30rem] grid-cols-3">
          <TabsTrigger value="profile">Access Profiles</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>
      </div>
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
                      src={`${apiUrl}/${combinedUser?.profile_picture.original}`}
                    />
                    <AvatarFallback className="object-cover object-center w-20 h-20 rounded-full mx-auto border border-8px">
                      {token.user_name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-bold text-center">
                    {combinedUser?.first_name} {combinedUser?.last_name}
                  </h4>
                  <h4 className="text-center">
                    Job Title : {combinedUser?.job_title}
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
        <UpdateProfile />
      </TabsContent>
    </Tabs>
  );
};

export default Profile;
