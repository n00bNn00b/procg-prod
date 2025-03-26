// import { Button } from "react-day-picker";
import { Button } from "@/components/ui/button";
import MailSelectionImage from "./MailSelectionImage.svg";
import MobileSelectionImage from "./MobileSectionImage.svg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Info } from "lucide-react";

import { tailspin } from "ldrs";
tailspin.register();

interface Props {
  setVerifyClick: Dispatch<SetStateAction<string>>;
  selectedID: string;
  errorCode: boolean;
  setErrorCode: Dispatch<SetStateAction<boolean>>;
  checkedMethod: string;
}
const Body3 = ({
  setVerifyClick,
  selectedID,
  errorCode,
  setErrorCode,
  checkedMethod,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState(180);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVerified = () => {
    try {
      setIsLoading(true);
      if (otp === "111111") {
        setErrorCode(true);
        // setOtp("");
      } else if (otp.length === 6 && otp !== "111111") {
        setErrorCode(false);
        setVerifyClick(otp);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setErrorCode(false);
  }, [otp]);

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
        <h3 className="font-semibold">Verification Code</h3>
        <h3 className="font-semibold">{`Enter the Verification code below we sent to ${selectedID}.`}</h3>
        <>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup className="flex flex-col gap-3">
              <div className="flex gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-[64px] h-[64px] cursor-pointer border rounded"
                  />
                ))}
              </div>
              {!errorCode && (
                <div className="flex justify-end w-full">
                  <h3> {formatTime(timeLeft)}</h3>
                </div>
              )}
            </InputOTPGroup>
          </InputOTP>
        </>
        {errorCode ? (
          <div className="text-Red-100 flex gap-1 items-center">
            <Info />
            <h3>Incorrect Verification Code</h3>
          </div>
        ) : (
          <h3>
            Didn't receive the verification code?{" "}
            <span
              className={`${timeLeft === 0 && "text-blue-600 font-semibold"} `}
            >
              Resend
            </span>
            .
          </h3>
        )}

        <Button
          disabled={otp.length !== 6 && !errorCode}
          onClick={handleVerified}
        >
          {isLoading ? (
            <l-tailspin size="40" stroke="5" speed="0.9" color="black" />
          ) : (
            "Verify"
          )}
        </Button>
      </div>
      <div>{/* <Button disabled={!selectedID}>Send</Button> */}</div>
    </div>
  );
};

export default Body3;
