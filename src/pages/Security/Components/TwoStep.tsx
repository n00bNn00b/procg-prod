import { ChevronDown, ChevronRight, Key } from "lucide-react";
import { useState } from "react";

const TwoStep = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`flex flex-col gap-2 ${isOpen && "p-4 bg-[#f5f5f5]"}`}>
      <div className="bg-[#b4d6f3] p-4">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="font-semibold">Two-step Verification</h3>
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </div>
        {isOpen && (
          <p>
            Protect your account with extra an extra verification step. Use an
            authenticator app or receive codes via email to confirm your
            identity each time you log in.
          </p>
        )}
      </div>
      {isOpen && (
        <div className="flex gap-2 p-2 bg-white text-slate-400 w-28 border rounded-md">
          <Key /> <span>Update</span>
        </div>
      )}
    </div>
  );
};

export default TwoStep;
