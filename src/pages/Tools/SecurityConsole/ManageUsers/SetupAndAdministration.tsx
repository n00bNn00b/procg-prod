import { useEffect, useState } from "react";
import { UsersTable } from "./UsersTable/UsersTable";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  IProfilesType,
  IUsersInfoTypes,
} from "@/types/interfaces/users.interface";
import { UserProfileTable } from "./UserProfileTable/UserProfileTable";

const SetupAndAdministration = () => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IProfilesType[]>([]);
  // const [filterUserID, setFilterUserID] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUsersInfoTypes[]>([]);
  const [primaryCheckedItem, setPrimaryCheckedItem] = useState<IProfilesType>();
  const [isUpdated, setIsUpdated] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedUsers.length === 1) {
          setIsLoading(true);
          const resData = await api.get(
            `${url}/access-profiles/${selectedUsers[0].user_id}`
          );
          // is primary available
          const filterPrimaryData = resData.data.find(
            (item: IProfilesType) => item.primary_yn === "Y"
          );
          setPrimaryCheckedItem(filterPrimaryData);

          setData(resData.data);
        }
        if (selectedUsers.length > 1 || selectedUsers.length === 0) {
          setData([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedUsers, isUpdated]);

  return (
    <div>
      <UsersTable
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      <UserProfileTable
        profileData={data}
        isUpdated={isUpdated}
        setIsUpdated={setIsUpdated}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        selectedUsers={selectedUsers}
        primaryCheckedItem={primaryCheckedItem}
      />
    </div>
  );
};
export default SetupAndAdministration;
