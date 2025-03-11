import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { AvatarFallback } from "@/components/ui/avatar";
import ProfileTable from "./Table/ProfileTable";
import { Plus } from "lucide-react";

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

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!token) return;
        setIsLoading(true);
        if (combinedUser) {
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
        <div className="flex flex-col gap-2">
          <div className="px-4 py-2 font-bold">My profiles</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="grid col-span-2">
              <div className="flex gap-4 items-center p-4 bg-[#cedef2]">
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
              <div className="flex flex-row-reverse my-2 text-white cursor-pointer">
                <div className="bg-[#2563eb] rounded px-2 flex gap-2 items-center">
                  <Plus size={15} className="border border-white rounded-md" />
                  <h3>Add Profile</h3>
                </div>
              </div>
              <ProfileTable />
            </div>
            <div className="border bg-[#cedef2] p-4">
              <div className="font-bold">Access Profiles</div>
              <div className="bg-white flex items-center justify-center p-24 mt-4">
                <QRCodeCanvas
                  value={JSON.stringify(accessProfiles)}
                  title={"Access Profiles"}
                  size={150}
                  // imageSettings={{
                  //   src: "/favicon.svg",
                  //   x: undefined,
                  //   y: undefined,
                  //   height: 24,
                  //   width: 24,
                  //   opacity: 1,
                  //   excavate: true,
                  // }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
