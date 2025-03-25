import CustomModal4 from "@/components/CustomModal/CustomModal4";
import { Image, X } from "lucide-react";
import { Dispatch, DragEvent, SetStateAction, useState } from "react";
import UpdateImageFile from "./UpdateImageFile.svg";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import DefaultLogo from "/public/profile/loading.gif";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { tailspin } from "ldrs";
tailspin.register();

interface Props {
  setIsEditProfileImage: Dispatch<SetStateAction<boolean>>;
}
const SelectImageModal = ({ setIsEditProfileImage }: Props) => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const { combinedUser, setCombinedUser, isCombinedUserLoading } =
    useGlobalContext();

  const [profileImage, setProfileImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === "profileImage" && files?.[0]) {
      setFile(files[0]);
      setProfileImage(URL.createObjectURL(files[0]));
    }
  };
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0]; // Get the first file dropped
    if (file && file.type.startsWith("image")) {
      setFile(file);
      setProfileImage(URL.createObjectURL(file));
    } else {
      toast({
        description: "Please drop a valid image file!",
      });
    }
    setIsDragOver(false);
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
      <CustomModal4 className="w-[626px] h-[490px]">
        <div className=" ">
          <div className="flex justify-between bg-[#CEDEF2] p-5">
            <h3 className="font-semibold">Update Profile Image</h3>
            <X
              onClick={() => setIsEditProfileImage(false)}
              className="cursor-pointer"
            />
          </div>
          <div className="p-8 flex flex-col items-center justify-center gap-16">
            <div className="flex flex-col items-center">
              <div>
                <img src={UpdateImageFile} alt="Image" />
              </div>
              <div className="flex flex-col gap-[14px]">
                <h3 className="text-[14px]">Image</h3>
                <label
                  htmlFor="imageUpload"
                  aria-label="Upload profile image"
                  className={`border border-black border-dashed rounded w-[364px] h-[128px] flex flex-col items-center justify-between p-5 cursor-pointer ${
                    isDragOver && "bg-slate-200"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {file ? (
                    <>
                      <Avatar className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 ">
                        <AvatarImage
                          src={
                            isCombinedUserLoading ? DefaultLogo : profileImage
                          }
                          alt="Profile image"
                        />
                        <AvatarFallback>
                          {combinedUser?.user_name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-center text-[#4F4F4F]">{file.name}</p>
                    </>
                  ) : (
                    <>
                      <Image />
                      <p className="text-center text-[#4F4F4F]">
                        Drop image here or click to browse Maximum file size
                        200KB.
                      </p>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  name="profileImage"
                  onChange={handleChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Button disabled={!file} onClick={handleSubmit}>
                {isLoading ? (
                  <l-tailspin size={16} stroke="3" speed="2" color="white" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CustomModal4>
    </>
  );
};

export default SelectImageModal;
