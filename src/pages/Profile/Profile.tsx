import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
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
    <>
      {isLoading ? (
        <div className="text-center">Loading</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 border p-4 font-bold">My profiles</div>
            <div className="border p-4 font-bold">Access Profiles</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="grid col-span-2">
              <div className="border flex gap-4 items-center p-8 mb-2">
                <>
                  <Avatar>
                    <AvatarImage
                      className="object-cover object-center w-20 h-20 rounded-full mx-auto border border-8px"
                      src={`${apiUrl}/${combinedUser?.profile_picture.original}`}
                    />
                    <AvatarFallback className="object-cover object-center w-20 h-20 rounded-full mx-auto border border-8px">
                      {token.user_name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </>
                <div className="p-2">
                  <h5 className="font-bold">
                    {combinedUser?.first_name} {combinedUser?.last_name}
                  </h5>
                  <h5 className="font-medium uppercase">
                    {combinedUser?.job_title}
                  </h5>
                  <h5 className="font-medium">Id: {combinedUser?.user_id}</h5>
                </div>
              </div>
              <div className="border p-8 flex flex-col gap-3">
                <h3 className="font-bold">Personal Info</h3>
                <div className="grid grid-cols-3">
                  <div>
                    <h5>User Name</h5>
                    <h3 className="font-medium">{combinedUser?.user_name}</h3>
                  </div>
                  <div>
                    <h5>First Name</h5>
                    <h3 className="font-medium">{combinedUser?.first_name}</h3>
                  </div>
                  <div>
                    <h5>Last Name</h5>
                    <h3 className="font-medium">{combinedUser?.last_name}</h3>
                  </div>
                </div>
                <div>
                  <h5>Emails</h5>
                  <h3 className="font-medium">
                    {combinedUser?.email_addresses}
                  </h3>
                </div>
              </div>
            </div>
            <div className="border p-6 flex items-center justify-center">
              <QRCodeCanvas
                value={JSON.stringify(accessProfiles)}
                title={"Access Profiles"}
                size={150}
                imageSettings={{
                  src: "/favicon.svg",
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  opacity: 1,
                  excavate: true,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
