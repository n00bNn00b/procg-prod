import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import SuccessFullyEnableImage from "./SuccessfullyEnableImage.svg";
interface Props {
  setTwoStepModal1: Dispatch<SetStateAction<boolean>>;
}
const Body4 = ({ setTwoStepModal1 }: Props) => {
  return (
    <div className="flex flex-col gap-10 justify-center items-center p-5">
      <img
        src={SuccessFullyEnableImage}
        alt="SuccessFullyEnableImage"
        className="w-[220px] h-[153px]"
      />
      <div className="flex flex-col gap-4 items-center">
        <h3 className="font-semibold">Successfully Enabled</h3>
        <p>Your two-step verification has been successfully completed.</p>
      </div>
      <Button onClick={() => setTwoStepModal1(false)}>Done</Button>
    </div>
  );
};

export default Body4;
