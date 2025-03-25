import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import MailSelectionImage from "./MailSelectionImage.svg";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { IProfilesType } from "@/types/interfaces/users.interface";

interface Props {
  filterType: string;
  selectedID: string;
  setSelectedID: Dispatch<SetStateAction<string>>;
  setSendClick: Dispatch<SetStateAction<string>>;
}
const Body2 = ({
  filterType,
  selectedID,
  setSelectedID,
  setSendClick,
}: Props) => {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const { combinedUser } = useGlobalContext();
  const [data, setData] = useState<IProfilesType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (combinedUser?.user_id) {
          const resData = await api.get<IProfilesType[]>(
            `${url}/access-profiles/${combinedUser?.user_id}`
          );
          console.log(resData, "resData");
          if (resData) {
            setData(
              resData.data.filter((item) => item.profile_type === filterType)
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-5 items-center">
      <div className="flex flex-col gap-4 items-center">
        <img
          src={MailSelectionImage}
          alt="Mail Image"
          className="w-[120px] h-90px"
        />

        <h3 className="font-medium">Enter your email to receive an OTP</h3>
        <div className="flex flex-col gap-3">
          <h5>Email</h5>
          <Select
            defaultValue={selectedID}
            onValueChange={(value) => setSelectedID(value)}
          >
            <SelectTrigger className="w-[480px]">
              <SelectValue placeholder="Select a option" />
            </SelectTrigger>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={item.profile_id} value={item.profile_id}>
                  {item.profile_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Button disabled={!selectedID} onClick={() => setSendClick(selectedID)}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Body2;
