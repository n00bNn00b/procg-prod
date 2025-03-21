import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { QRCodeCanvas } from "qrcode.react";
import { AvatarFallback } from "@/components/ui/avatar";
import ProfileTable, { IProfilesType1 } from "./Table/ProfileTable";
import { Search, SquarePlus, X } from "lucide-react";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";

import CreateAccessProfile from "./CreateAccessProfile/CreateAccessProfile";
import { Input } from "@/components/ui/input";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProfilesType } from "@/types/interfaces/users.interface";

const Profile = () => {
  const { combinedUser, isCombinedUserLoading } = useGlobalContext();
  const url = import.meta.env.VITE_API_URL;
  const api = useAxiosPrivate();
  const [isCreateNewProfile, setIsCreateNewProfile] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IProfilesType1[]>([]);
  const [isUpdated, setIsUpdated] = useState<number>(0);
  const [selectedProfileType, setSelectedProfileType] = useState("");
  const [primaryCheckedItems, setPrimaryCheckedItems] = useState<
    IProfilesType[]
  >([]);

  const filterProfileType = data.filter(
    (item) => item.profile_type === selectedProfileType
  );
  const filteredData = filterProfileType.filter((item) =>
    item.profile_id.includes(searchInput)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (combinedUser?.user_id) {
          setIsLoading(true);
          const resData = await api.get(
            `${url}/access-profiles/${combinedUser?.user_id}`
          );
          // is primary available
          const filterPrimaryData = resData.data.filter(
            (item: IProfilesType) => item.primary_yn === "Y"
          );
          setPrimaryCheckedItems(filterPrimaryData);

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

  const uniqueProfiles = data.filter(
    (value, index, self) =>
      self.findIndex(
        (profile) => profile.profile_type === value.profile_type
      ) === index
  );

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
                <div className="grid grid-cols-11 gap-[10px] my-2  cursor-pointer">
                  {/* search */}
                  <div className="col-span-6 flex gap-2 items-center h-10 relative">
                    <Input
                      type="text"
                      value={searchInput}
                      className="border-[#1B5FF2] border-2 p-2 text-black"
                      placeholder="Search Profile ID"
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button className="absolute right-0 bg-[#1B5FF2] p-[9px] rounded-r">
                      <Search size={20} className="  text-white" />
                    </button>
                    {searchInput && (
                      <button
                        className="absolute right-10"
                        onClick={() => setSearchInput("")}
                      >
                        <X size={20} className="text-[#1B5FF2]" />
                      </button>
                    )}
                  </div>
                  {/* select profile type */}
                  <div className="col-span-3">
                    <Select
                      value={selectedProfileType}
                      onValueChange={(e) => setSelectedProfileType(e)}
                    >
                      <SelectTrigger className="border-[#1B5FF2] border-2">
                        <SelectValue placeholder="Select Profile Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.length > 0 ? (
                          uniqueProfiles.map((item) => (
                            <SelectItem
                              key={item.serial_number}
                              value={item.profile_type}
                            >
                              {item.profile_type}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="None">
                            None
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
                  profiles={searchInput ? filteredData : data}
                  setIsUpdated={setIsUpdated}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  primaryCheckedItems={primaryCheckedItems}
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
