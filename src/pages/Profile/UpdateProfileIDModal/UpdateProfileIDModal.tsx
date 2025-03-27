import CustomModal4 from "@/components/CustomModal/CustomModal4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { IProfilesType1 } from "../Table/ProfileTable";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/Spinner/Spinner";
import "../customStyle.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Checkbox } from "@/components/ui/checkbox";
import { IProfilesType } from "@/types/interfaces/users.interface";

interface ICustomModalTypes {
  editableProfile: IProfilesType1;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdated: React.Dispatch<React.SetStateAction<number>>;
  primaryCheckedItem: IProfilesType | undefined;
}
const UpdateProfileIDModal = ({
  editableProfile,
  setIsOpenModal,
  isLoading,
  setIsLoading,
  setIsUpdated,
  primaryCheckedItem,
}: ICustomModalTypes) => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const [profileId, setProfileId] = useState<string>(
    editableProfile.profile_id
  );
  const [isPrimary, setIsPrimary] = useState<string>(
    editableProfile.primary_yn
  );
  const [isChecked, setIsChecked] = useState(
    editableProfile.primary_yn === "Y" ? true : false
  );

  useEffect(() => {
    if (isChecked) {
      if (
        primaryCheckedItem &&
        primaryCheckedItem.primary_yn !== editableProfile.primary_yn
      )
        toast({ description: `Primary profile already exists.` });
    }
  }, [isChecked]);
  // console.log(primaryCheckedItem, "primaryCheckedItem");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = {
        profile_id: profileId,
        primary_yn: isPrimary,
      };

      if (isChecked) {
        if (
          primaryCheckedItem &&
          primaryCheckedItem.primary_yn !== editableProfile.primary_yn
        ) {
          try {
            await api.put(
              `${url}/access-profiles/${primaryCheckedItem.user_id}/${primaryCheckedItem.serial_number}`,
              { ...primaryCheckedItem, primary_yn: "N" }
            );
            // console.log(response.data, "response");
          } catch (error) {
            console.error("Error updating profile:", error);
          }
        }
      }

      const res = await api.put(
        `${url}/access-profiles/${editableProfile.user_id}/${editableProfile.serial_number}`,
        data
      );

      if (res.status === 200) {
        toast({
          description: `${res.data.message}`,
        });
        setIsOpenModal(false);
        setIsUpdated(Math.random() + 23 * 3000);
      }
    } catch (error) {
      console.log(error, "error");
      toast({
        description: `Failed to update`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <CustomModal4 className="h-[384px] w-[770px]">
        <div className="flex justify-between bg-[#CEDEF2] p-5">
          <h3 className="font-semibold">Update Profile</h3>
          <X onClick={() => setIsOpenModal(false)} className="cursor-pointer" />
        </div>
        <div className="p-8">
          <form
            className="flex flex-col justify-between gap-8 h-[253px]"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="profile_type">Profile Type</label>
                <Input
                  type="text"
                  disabled
                  id="profile_type"
                  value={editableProfile.profile_type}
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="profile_type">Profile ID</label>
                {editableProfile.profile_type === "Mobile Number" ? (
                  <PhoneInput
                    international
                    defaultCountry="BD"
                    placeholder="Enter phone number"
                    value={profileId as string}
                    onChange={(e) => setProfileId(e as string)}
                    className="w-full text-xl focus:outline-none transition duration-300 ease-in-out px-2 py-1 rounded mr-2 h-10 border"
                  />
                ) : (
                  <Input
                    type="text"
                    autoFocus
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                  />
                )}
              </div>

              <div className="flex flex-col items-center gap-2 ">
                <label htmlFor="primary">Primary</label>
                <Checkbox
                  checked={isPrimary === "Y" ? true : false}
                  id="primary"
                  className="my-auto"
                  onCheckedChange={(e) => {
                    setIsPrimary(e === true ? "Y" : "N");
                    setIsChecked(isPrimary !== "Y" ? true : false);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="px-4 py-2">
                {isLoading ? <Spinner size="25" color="white" /> : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </CustomModal4>
    </>
  );
};

export default UpdateProfileIDModal;
