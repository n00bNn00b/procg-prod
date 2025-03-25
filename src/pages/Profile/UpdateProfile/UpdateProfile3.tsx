import React, { useMemo, useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import DefaultLogo from "/public/profile/loading.gif";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pen } from "lucide-react";
import "../customStyle.css";
import { tailspin } from "ldrs";
import SelectImageModal from "./SelectImageModal";
tailspin.register();

const UpdateProfile3: React.FC = () => {
  const url = import.meta.env.VITE_API_URL;
  const { combinedUser, isCombinedUserLoading } = useGlobalContext();
  const [isEditProfileImage, setIsEditProfileImage] = useState(false);

  const profileLogo = useMemo(() => {
    return isCombinedUserLoading
      ? DefaultLogo
      : combinedUser?.profile_picture.original
      ? `${url}/${combinedUser.profile_picture.original}`
      : `${url}/uploads/profiles/default/loading.gif`;
  }, [combinedUser?.profile_picture.original]);

  return (
    <>
      {isEditProfileImage && (
        <SelectImageModal setIsEditProfileImage={setIsEditProfileImage} />
      )}
      <div className="relative w-[76px] h-[76px] rounded-full">
        <Avatar className="w-full h-full rounded-full object-cover border-2 border-gray-300 ">
          <AvatarImage
            src={isCombinedUserLoading ? DefaultLogo : profileLogo}
            alt="Profile image"
          />
          <AvatarFallback>{combinedUser?.user_name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <Pen
          className="absolute bottom-0 left-2 bg-gray-400 p-1 rounded-full cursor-pointer hover:bg-gray-500 "
          onClick={() => setIsEditProfileImage(!isEditProfileImage)}
        />
      </div>
    </>
  );
};

export default UpdateProfile3;
