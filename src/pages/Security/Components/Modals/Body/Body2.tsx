import { Dispatch, SetStateAction } from "react";
import MailSelectionImage from "./MailSelectionImage.svg";
import MobileSelectionImage from "./MobileSectionImage.svg";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProfilesType } from "@/types/interfaces/users.interface";

interface Props {
  data: IProfilesType[];
  selectedID: string;
  setSelectedID: Dispatch<SetStateAction<string>>;
  setSendClick: Dispatch<SetStateAction<string>>;
  checkedMethod: string;
}
const Body2 = ({
  data,
  selectedID,
  setSelectedID,
  setSendClick,
  checkedMethod,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 p-5 items-center">
      <div className="flex flex-col gap-4 items-center">
        <img
          src={
            checkedMethod === "Email"
              ? MailSelectionImage
              : MobileSelectionImage
          }
          alt="Mail Image"
          className="w-[120px] h-90px"
        />

        <h3 className="font-medium">Enter your email to receive an OTP</h3>
        <div className="flex flex-col gap-3">
          <h5>{checkedMethod}</h5>
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
