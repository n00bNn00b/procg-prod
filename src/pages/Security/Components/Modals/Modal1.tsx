import CustomModal4 from "@/components/CustomModal/CustomModal4";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Body1 from "./Body/Body1";
import Body2 from "./Body/Body2";
import Body3 from "./Body/Body3";
import Body4 from "./Body/Body4";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { IProfilesType } from "@/types/interfaces/users.interface";

interface Props {
  setTwoStepModal1: Dispatch<SetStateAction<boolean>>;
}

const Modal1 = ({ setTwoStepModal1 }: Props) => {
  const [checkedMethod, setCheckedMethod] = useState("");
  const [nextClick, setNextClick] = useState("");
  const [sendClick, setSendClick] = useState("");
  const [verifyClick, setVerifyClick] = useState("");
  const [selectedID, setSelectedID] = useState("");

  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_NODE_ENDPOINT_URL;
  const { combinedUser } = useGlobalContext();
  const [data, setData] = useState<IProfilesType[]>([]);
  const [errorCode, setErrorCode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (combinedUser?.user_id) {
          const resData = await api.get<IProfilesType[]>(
            `${url}/access-profiles/${combinedUser?.user_id}`
          );
          if (resData) {
            setData(
              resData.data.filter((item) => item.profile_type === checkedMethod)
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [checkedMethod]);

  return (
    <div>
      <CustomModal4 className="w-[805px]  ">
        {!verifyClick && (
          <div className="flex justify-between bg-[#CEDEF2] px-4 py-[10px]">
            <h3 className="font-semibold p-[10px]">Two-Step Authentication</h3>
            <X
              onClick={() => setTwoStepModal1(false)}
              className="cursor-pointer"
            />
          </div>
        )}
        {!nextClick && (
          <Body1
            checkedMethod={checkedMethod}
            setCheckedMethod={setCheckedMethod}
            setNextClick={setNextClick}
          />
        )}
        {nextClick && !sendClick && (
          <Body2
            data={data}
            selectedID={selectedID}
            setSelectedID={setSelectedID}
            setSendClick={setSendClick}
            checkedMethod={checkedMethod}
          />
        )}
        {selectedID && sendClick && !verifyClick && (
          <Body3
            setVerifyClick={setVerifyClick}
            selectedID={selectedID}
            errorCode={errorCode}
            setErrorCode={setErrorCode}
            checkedMethod={checkedMethod}
          />
        )}
        {verifyClick && !errorCode && (
          <Body4 setTwoStepModal1={setTwoStepModal1} />
        )}
      </CustomModal4>
    </div>
  );
};

export default Modal1;
