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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface ICreateAccessProfileTypes {
  setIsCreateNewProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateAccessProfile = ({
  setIsCreateNewProfile,
}: ICreateAccessProfileTypes) => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const [profileType, setProfileType] = useState("");
  const [profileId, setProfileId] = useState<number | string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        profiles: [{ profile_type: profileType, profile_id: profileId }],
      };
      const res = await api.post(`${url}/access-profiles`, data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(profileId, "profileId");
  return (
    <CustomModal4 h={"h-[384px]"} w="w-[770px]">
      <div className="h-full">
        <div className="flex justify-between bg-[#CEDEF2] p-5">
          <h3 className="font-semibold">Create Access Profile</h3>
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
              <div className="flex flex-col gap-2 w-full">
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
                    <SelectItem value="Username">Username</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="profile_type">Profile ID</label>
                {profileType === "Mobile Number" ? (
                  <PhoneInput
                    country={"bd"}
                    value={profileId as string}
                    onChange={(e) => setProfileId(e)}
                    inputStyle={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                    }}
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
                Add
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CustomModal4>
  );
};

export default CreateAccessProfile;
