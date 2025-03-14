import { FilePenLine, Verified } from "lucide-react";
import ChangePassword from "../ChangePassword";
import { useState } from "react";

const Passwords = () => {
  const [isOpenUpdateBtn, setIsOpenUpdateBtn] = useState(false);
  return (
    <div className="bg-[#f5f5f5] p-4">
      <div className="p-4 bg-[#b4d6f3]">
        <h3 className="font-semibold">Password</h3>
        <p>Set a password to protect your account</p>
      </div>
      {isOpenUpdateBtn ? (
        <ChangePassword setIsOpenUpdateBtn={setIsOpenUpdateBtn} />
      ) : (
        <div className="flex flex-col gap-2 p-2">
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
    </div>
  );
};

export default Passwords;
