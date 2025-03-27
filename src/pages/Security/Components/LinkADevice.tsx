import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { ChevronDown, ChevronRight } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

const LinkADevice = () => {
  const { token } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex flex-col gap-2 ${
        isOpen && "bg-[#f5f5f5] p-4 "
      } transition-all duration-300 ease-in-out`}
    >
      <div className="bg-[#b4d6f3] p-4">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="font-semibold">Link a Device</h3>
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </div>
        <div>
          {isOpen && (
            <>
              <p className="pb-2">Scan the QR code with your Mobile App</p>
              <div className="bg-white p-[10px] inline-block">
                <QRCodeCanvas
                  value={JSON.stringify(token.access_token)}
                  title={"Link Account"}
                  size={150}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkADevice;
