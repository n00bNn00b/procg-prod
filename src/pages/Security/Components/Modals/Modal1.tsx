import CustomModal4 from "@/components/CustomModal/CustomModal4";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Body1 from "./Body/Body1";
import Body2 from "./Body/Body2";
import Body3 from "./Body/Body3";

interface Props {
  setTwoStepModal1: Dispatch<SetStateAction<boolean>>;
}

const Modal1 = ({ setTwoStepModal1 }: Props) => {
  const [checkedMethod, setCheckedMethod] = useState("");
  const [nextClick, setNextClick] = useState("");
  const [sendClick, setSendClick] = useState("");
  const [selectedID, setSelectedID] = useState("");
  return (
    <div>
      <CustomModal4 className="w-[805px]  ">
        <div className="flex justify-between bg-[#CEDEF2] px-4 py-[10px]">
          <h3 className="font-semibold p-[10px]">Two-Step Authentication</h3>
          <X
            onClick={() => setTwoStepModal1(false)}
            className="cursor-pointer"
          />
        </div>
        {!nextClick && (
          <Body1
            checkedMethod={checkedMethod}
            setCheckedMethod={setCheckedMethod}
            setNextClick={setNextClick}
          />
        )}
        {nextClick && !sendClick && (
          <Body2
            filterType={checkedMethod}
            selectedID={selectedID}
            setSelectedID={setSelectedID}
            setSendClick={setSendClick}
          />
        )}
        {selectedID && sendClick && (
          <Body3
          // selectedID={selectedID}
          // setSendClick={setSendClick}
          // setNextClick={setNextClick}
          />
        )}
      </CustomModal4>
    </div>
  );
};

export default Modal1;
