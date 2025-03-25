import { ChevronDown, ChevronRight, Key } from "lucide-react";
import { useState } from "react";
import Modal1 from "./Modals/Modal1";

const TwoStep = () => {
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const [twoStepModal1, setTwoStepModal1] = useState(false);
  return (
    <div
      className={`flex flex-col gap-2 ${isOpenAccordion && "p-4 bg-[#f5f5f5]"}`}
    >
      <div className="bg-[#b4d6f3] p-4">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setIsOpenAccordion(!isOpenAccordion)}
        >
          <h3 className="font-semibold">Two-step Verification</h3>
          {isOpenAccordion ? <ChevronDown /> : <ChevronRight />}
        </div>
        {isOpenAccordion && (
          <p>
            Protect your account with extra an extra verification step. Use an
            authenticator app or receive codes via email to confirm your
            identity each time you log in.
          </p>
        )}
      </div>
      {isOpenAccordion && (
        <div
          className="flex gap-2 p-[10px] bg-white w-[111px] border rounded-md cursor-pointer"
          onClick={() => setTwoStepModal1(true)}
        >
          <Key /> <h3 className="w-full">Turn on</h3>
        </div>
      )}
      {/* Modal 1 */}
      {twoStepModal1 && (
        <>
          <Modal1 setTwoStepModal1={setTwoStepModal1} />
        </>
      )}
    </div>
  );
};

export default TwoStep;
