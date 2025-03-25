// import { Button } from "react-day-picker";
import MailSelectionImage from "./MailSelectionImage.svg";

const Body3 = () => {
  return (
    <div className="flex flex-col gap-4 p-5 items-center">
      <div className="flex flex-col gap-4 items-center">
        <img
          src={MailSelectionImage}
          alt="Mail Image"
          className="w-[120px] h-90px"
        />

        <h3 className="font-medium">Send OTP</h3>
      </div>
      <div>{/* <Button disabled={!selectedID}>Send</Button> */}</div>
    </div>
  );
};

export default Body3;
