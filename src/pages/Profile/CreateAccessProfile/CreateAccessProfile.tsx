import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CustomModal4 from "@/components/CustomModal/CustomModal4";
import { X } from "lucide-react";
import { useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import "../customStyle.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/Spinner/Spinner";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

interface ICreateAccessProfileTypes {
  setIsCreateNewProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdated: React.Dispatch<React.SetStateAction<number>>;
}

const CreateAccessProfile = ({
  setIsCreateNewProfile,
  setIsUpdated,
}: ICreateAccessProfileTypes) => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const { combinedUser } = useGlobalContext();
  const [profileType, setProfileType] = useState("");
  const [profileId, setProfileId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = { profile_type: profileType, profile_id: profileId };
      // console.log(data, "data");
      const res = await api.post(
        `${url}/access-profiles/${combinedUser?.user_id}`,
        data
      );

      if (res) {
        setIsUpdated(Math.random() + 23 * 3000);
        toast({
          description: `${res.data.message}`,
        });
        setIsCreateNewProfile(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal4 h={"h-[384px]"} w="w-[770px]">
      <div className="h-full">
        <div className="flex justify-between bg-[#CEDEF2] p-5">
          <h3 className="font-semibold">Add Profile</h3>
          <X
            onClick={() => setIsCreateNewProfile(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-8">
          <form
            className="flex flex-col justify-between gap-8 h-[253px]"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-[300px]">
                <label htmlFor="profile_type">Profile Type</label>
                <Select
                  onValueChange={(e) => {
                    setProfileType(e);
                    setProfileId("");
                  }}
                  value={profileType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Profile Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Mobile Number">Mobile Number</SelectItem>
                    <SelectItem value="GUID">GUID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="profile_type">Profile ID</label>
                {profileType === "Mobile Number" ? (
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
                    type={profileType === "GUID" ? "number" : "text"}
                    autoFocus
                    disabled={profileType === ""}
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                    placeholder={`Enter ${profileType}`}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="px-4 py-2">
                {isLoading ? <Spinner size="25" color="white" /> : "Add"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CustomModal4>
  );
};

export default CreateAccessProfile;
