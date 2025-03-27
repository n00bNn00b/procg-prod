import { ChevronDown, ChevronRight, FilePenLine, Verified } from "lucide-react";
import ChangePassword from "../ChangePassword";
import { useState } from "react";

const Passwords = () => {
  const [isOpenUpdateBtn, setIsOpenUpdateBtn] = useState(false);
  const [isOpenAccordion, setIsOpenAccordion] = useState(true);
  return (
    <div
      className={`flex flex-col gap-2 ${
        isOpenAccordion && "bg-[#f5f5f5] p-4"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 bg-[#b4d6f3]">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setIsOpenAccordion(!isOpenAccordion)}
        >
          <h3 className="font-semibold">Password</h3>
          {isOpenAccordion ? <ChevronDown /> : <ChevronRight />}
        </div>
        {isOpenAccordion && <p>Set a password to protect your account</p>}
      </div>
      {isOpenAccordion && !isOpenUpdateBtn && (
        <div className="flex flex-col gap-2 p-2 bg-[#f5f5f5]">
          <p className="text-slate-400">*************</p>
          <div className="flex gap-2 text-green-500">
            <Verified size={24} /> <span>Very Secure</span>
          </div>
          <div
            className="flex gap-2 px-[10px] py-[8px] bg-white w-[103px] h-[42px] border rounded-md cursor-pointer"
            onClick={() => setIsOpenUpdateBtn(!isOpenUpdateBtn)}
          >
            <FilePenLine /> <span>Update</span>
          </div>
        </div>
      )}
      {isOpenUpdateBtn && (
        <ChangePassword setIsOpenUpdateBtn={setIsOpenUpdateBtn} />
      )}
    </div>
  );
};

export default Passwords;
