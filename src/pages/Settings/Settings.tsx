import { toast } from "@/components/ui/use-toast";
import { Check, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

const Settings = () => {
  const url = import.meta.env.VITE_API_URL;
  const [isCopyURL, setIsCopyURL] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setIsCopyURL(true);
        toast({ description: "Text copied to clipboard!" });
      },
      (err) => {
        setIsCopyURL(false);
        toast({ description: "Failed to copy text!" });
        console.error("Error copying text: ", err);
      }
    );
  };

  return (
    <div>
      <div className="bg-[#cedef2] p-4 inline-block">
        <h3 className="font-semibold">URL Link</h3>
        <p>Scan the QR code with your Mobile App</p>
        <div className="p-10 flex items-center justify-center bg-white my-4">
          <QRCodeCanvas
            value={JSON.stringify(url)}
            title={"Link Account"}
            size={150}
          />
        </div>
        <p className="w-[22rem] mb-4">
          If you can’t scan the QR code, you can copy or type this URL to your
          mobile app.
        </p>
        <div className="px-4 py-2 bg-white w-full flex justify-between">
          <p>{url}</p>
          {isCopyURL ? (
            <Check
              onClick={handleCopy}
              className="cursor-pointer text-green-500"
            />
          ) : (
            <Copy
              onClick={handleCopy}
              className="cursor-pointer text-red-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Settings;
