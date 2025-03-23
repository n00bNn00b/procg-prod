import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { QRCodeCanvas } from "qrcode.react";
import { AvatarFallback } from "@/components/ui/avatar";
import ProfileTable, { IProfilesType1 } from "./Table/ProfileTable";
import { SquarePlus } from "lucide-react";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";

import CreateAccessProfile from "./CreateAccessProfile/CreateAccessProfile";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { IProfilesType } from "@/types/interfaces/users.interface";

const Profile = () => {
  const { combinedUser, isCombinedUserLoading } = useGlobalContext();
  const url = import.meta.env.VITE_API_URL;
  const api = useAxiosPrivate();
  const [isCreateNewProfile, setIsCreateNewProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IProfilesType1[]>([]);
  const [isUpdated, setIsUpdated] = useState<number>(0);
  const [primaryCheckedItem, setPrimaryCheckedItem] = useState<IProfilesType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (combinedUser?.user_id) {
          setIsLoading(true);
          const resData = await api.get(
            `${url}/access-profiles/${combinedUser?.user_id}`
          );
          // is primary available
          const filterPrimaryData = resData.data.find(
            (item: IProfilesType) => item.primary_yn === "Y"
          );
          setPrimaryCheckedItem(filterPrimaryData);

          setData(resData.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [combinedUser?.user_id, isUpdated]);

  return (
    <>
      {isCreateNewProfile && (
        <CreateAccessProfile
          setIsCreateNewProfile={setIsCreateNewProfile}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isCombinedUserLoading ? (
        <div className="flex flex-row min-h-[calc(100vh-100px)] justify-center items-center">
          <Spinner size="50" color="red"></Spinner>
        </div>
      ) : (
        <div className="pb-4">
          <div className="flex flex-col gap-3 border p-5">
            <div className="px-4 font-semibold">My Profiles</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid col-span-2">
                {/* User Information */}
                <div className="flex gap-5 items-center px-4 py-[14px] bg-[#cedef2]">
                  <>
                    <Avatar>
                      <AvatarImage
                        className="object-cover object-center w-[76px] h-[76px] rounded-full mx-auto border border-8px"
                        src={`${url}/${combinedUser?.profile_picture.original}`}
                      />
                      <AvatarFallback className="object-cover object-center w-[76px] h-[76px] rounded-full mx-auto border border-8px">
                        {combinedUser?.user_name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </>
                  <div className="p-2">
                    <h5 className="font-medium">
                      {combinedUser?.first_name} {combinedUser?.last_name}
                    </h5>
                    <h5 className="">{combinedUser?.job_title}</h5>
                    <h5 className="font-light">Id: {combinedUser?.user_id}</h5>
                  </div>
                </div>
                <div className="flex flex-row-reverse my-2  cursor-pointer">
                  {/* add profile */}
                  <div
                    className="bg-[#2563eb] rounded px-[10px] py-2 flex gap-1 items-center h-10 col-span-2 text-white"
                    onClick={() => setIsCreateNewProfile(true)}
                  >
                    <SquarePlus size={20} />
                    <h3 className="text-sm">Add Profile</h3>
                  </div>
                </div>
                {/* Profile Type Table*/}
                <ProfileTable
                  profiles={data}
                  setIsUpdated={setIsUpdated}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  primaryCheckedItem={primaryCheckedItem}
                />
              </div>
              <div>
                {/* QR Code */}
                <div className="border bg-[#cedef2] p-4">
                  <div className="font-semibold">Access Profiles</div>
                  <div className="bg-white flex items-center justify-center p-16  mt-4">
                    <QRCodeCanvas
                      value={JSON.stringify(combinedUser?.email_addresses)}
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
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
