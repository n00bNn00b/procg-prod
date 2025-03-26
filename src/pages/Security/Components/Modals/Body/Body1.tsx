import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";
interface Props {
  checkedMethod: string;
  setCheckedMethod: Dispatch<SetStateAction<string>>;
  setNextClick: Dispatch<SetStateAction<string>>;
}
const Body1 = ({ checkedMethod, setCheckedMethod, setNextClick }: Props) => {
  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div className="px-[10px] py-2 flex flex-col gap-[10px]">
        <h3 className="font-medium">Choose Verification Method</h3>
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Mobile Number</h3>
            <Checkbox
              checked={checkedMethod === "Mobile Number"}
              onCheckedChange={() => setCheckedMethod("Mobile Number")}
            />
          </div>
          <p>
            Use your mobile phone to receive a verification code to protect your
            account.
          </p>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Email</h3>
            <Checkbox
              checked={checkedMethod === "Email"}
              onCheckedChange={() => setCheckedMethod("Email")}
            />
          </div>
          <p>
            Use your mobile phone to receive a verification code to protect your
            account.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          disabled={!checkedMethod}
          onClick={() => {
            setNextClick(checkedMethod);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Body1;
