import React, { useState, useMemo } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "@/components/ui/use-toast";
import DefaultLogo from "/public/profile/loading.gif";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save } from "lucide-react";
import "../customStyle.css";
import { tailspin } from "ldrs";
tailspin.register();

const UpdateProfile: React.FC = () => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const { combinedUser, setCombinedUser, isCombinedUserLoading } =
    useGlobalContext();

  const profileLogo = useMemo(() => {
    return isCombinedUserLoading
      ? DefaultLogo
      : combinedUser?.profile_picture
      ? `${import.meta.env.VITE_API_URL}/${
          combinedUser.profile_picture.original
        }`
      : `${import.meta.env.VITE_API_URL}/uploads/profiles/default/loading.gif`;
  }, [isCombinedUserLoading, combinedUser?.profile_picture]);

  const [isImageSelected, setIsImageSelected] = useState(false);
  const [formData, setFormData] = useState(profileLogo);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === "profileImage" && files?.[0]) {
      setFile(files[0]);
      setFormData(URL.createObjectURL(files[0]));
      setIsImageSelected(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (file) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (file.size > 200000) {
        setIsLoading(false);
        return toast({
          description: "Image size should be less than 200kb",
        });
      }

      if (!allowedMimeTypes.includes(file.type)) {
        setIsLoading(false);
        return toast({
          description: "Only JPEG, PNG, and JPG images are allowed.",
        });
      }
    }

    try {
      const response = await api.put(
        `/combined-user/update-profile-image/${combinedUser?.user_id}`,
        {
          profileImage: file,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setCombinedUser((prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            profile_picture: {
              original: `${url}/uploads/profiles/${combinedUser?.user_name}/${file?.name}`,
              thumbnail: `${url}/uploads/profiles/${combinedUser?.user_name}/thumbnail.jpg`,
            },
          };
        });
        setIsImageSelected(false);
        toast({
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (err) {
      console.log(err, "err");
      toast({
        variant: "destructive",
        description: "Failed to update profile image.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-[76px] h-[76px] rounded-full">
        <Avatar className="w-full h-full rounded-full object-cover border-2 border-gray-300 ">
          <AvatarImage src={isCombinedUserLoading ? DefaultLogo : formData} />
          <AvatarFallback>{combinedUser?.user_name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <label
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
          <span className="tooltiptext">
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
        )}
      </div>
    </>
  );
};

export default UpdateProfile;
