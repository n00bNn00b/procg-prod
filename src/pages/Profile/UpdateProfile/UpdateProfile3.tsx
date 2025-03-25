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

  const [profileImage, setProfileImage] = useState(profileLogo);

  return (
    <>
      {isEditProfileImage && (
        <SelectImageModal
          setIsEditProfileImage={setIsEditProfileImage}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
        />
      )}
      <div className="relative w-[76px] h-[76px] rounded-full">
        <Avatar className="w-full h-full rounded-full object-cover border-2 border-gray-300 ">
          <AvatarImage
            src={isCombinedUserLoading ? DefaultLogo : profileImage}
            alt="Profile image"
          />
          <AvatarFallback>{combinedUser?.user_name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <Pen
          className="absolute bottom-0 left-2 bg-gray-400 p-1 rounded-full cursor-pointer hover:bg-gray-500 "
          onClick={() => setIsEditProfileImage(!isEditProfileImage)}
        />
        {/* <label
          htmlFor="imageUpload"
          className="absolute bottom-0 left-2 bg-gray-400 p-1 rounded-full cursor-pointer hover:bg-gray-500 tooltip"
          aria-label="Upload profile image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 3.487l3.651 3.651M4.5 20.25h3.75L19.62 8.88a1.125 1.125 0 000-1.591l-3.75-3.75a1.125 1.125 0 00-1.591 0L4.5 16.5v3.75z"
            />
          </svg>
          <span className="tooltiptext text-sm">
            Image size should be less than 200kb and only JPEG, PNG, and JPG
          </span>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            name="profileImage"
            onChange={handleChange}
            className="hidden"
            disabled={isLoading}
          />
        </label>
        {isImageSelected && (
          <button
            type="submit"
            className="absolute bottom-0 right-2 bg-gray-500 p-1 rounded-full cursor-pointer hover:bg-gray-600"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <div className="w-4 h-4">
                <l-tailspin
                  size={16}
                  stroke="3"
                  speed="2"
                  color="white"
                ></l-tailspin>
              </div>
            ) : (
              <Save size={16} color="white" />
            )}
          </button>
        )} */}
      </div>
    </>
  );
};

export default UpdateProfile3;
