import { FilePenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import CustomModal from "../CustomModal/CustomModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { tailspin } from "ldrs";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
tailspin.register();

export type IProfilesType = {
  id: number;
  email_addresses: string[];
  phones: string[];
  guid: string;
  username: string;
};
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

// const profiles = [
//   {
//     id: 1,
//     email_addresses: ["kallany_01@gmail.com", "kallany_02@gmaiI.com"],
//     phones: ["+8801234567890", "+8801234567890"],
//     guid: "5678299308765268",
//     username: "Kchakma",
//   },
// ];
// const d = [
//   {
//     id: 1,
//     email: "kallany_01@gmail.com",
//     primary: true,
//   },
//   {
//     id: 2,
//     email: "kallany_02@gmail.com",
//     primary: false,
//   },
//   {
//     id: 3,
//     username: "kchakma",
//     primary: false,
//   },
// ];
export interface IProfilesType1 {
  primary_yn: string;
  profile_id: string;
  profile_type: string;
  serial_number: number;
  user_id: number;
}
interface ProfileTableProps {
  profiles: IProfilesType1[];
  setIsUpdated: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProfileTable = ({
  profiles,
  setIsUpdated,
  isLoading,
  setIsLoading,
}: ProfileTableProps) => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [editableProfile, setEditableProfile] = useState<IProfilesType1>(
    {} as IProfilesType1
  );

  const editProfile = (profile: IProfilesType1) => {
    setIsUpdateProfile(true);
    setEditableProfile(profile);
    console.log(profile, "profile");
  };
  const displayOrder = ["Email", "Mobile Number", "GUID", "Username"];
  const sortedProfiles = profiles.sort(
    (a, b) =>
      displayOrder.indexOf(a.profile_type) -
      displayOrder.indexOf(b.profile_type)
  );
  const handleDelete = async (serial_number: number) => {
    try {
      const res = await api.delete(
        `${url}/access-profiles/${editableProfile.user_id}/${serial_number}`
      );
      if (res.status === 200) {
        toast({
          description: `${res.data.message}`,
        });
        setIsUpdated(Math.random() + 23 * 3000);
      }
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed to delete`,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="w-full">
      {isUpdateProfile && (
        <CustomModal
          editableProfile={editableProfile}
          setIsOpenModal={setIsUpdateProfile}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsUpdated={setIsUpdated}
        />
      )}
      <table className="w-full">
        <thead>
          <tr className="bg-[#CEDEF2] text-slate-500 text-left font-medium">
            <th className="border px-4 py-2 font-semibold">SL</th>
            <th className="border px-4 py-2 font-semibold">Profile Type</th>
            <th className="border px-4 py-2 font-semibold">Profile ID</th>
            <th className="border px-4 py-2 font-semibold">Primary</th>
            <th className="border px-4 py-2 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="h-20">
                <span className="flex items-center justify-center h-full">
                  <l-tailspin
                    size="40"
                    stroke="5"
                    speed="0.9"
                    color="red"
                  ></l-tailspin>
                </span>
              </td>
            </tr>
          ) : (
            <>
              {profiles.length > 0 ? (
                <>
                  {sortedProfiles?.map((item, i) => (
                    <tr key={item.serial_number}>
                      <td className="border px-4 py-2">{i + 1}</td>
                      <td className="border px-4 py-2 capitalize">
                        {item.profile_type}
                      </td>
                      <td className="border px-4 py-2">{item.profile_id}</td>
                      <td className="border px-4 py-2 capitalize">
                        <input
                          type="checkbox"
                          checked={item.primary_yn === "Y"}
                          readOnly
                        />
                      </td>
                      <td className="border px-4 py-2 flex gap-1">
                        <FilePenLine
                          className="cursor-pointer"
                          onClick={() => editProfile(item)}
                        />

                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Trash2 className="cursor-pointer" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.serial_number)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border px-4 py-2 text-center text-slate-500"
                  >
                    Profile not found
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileTable;
