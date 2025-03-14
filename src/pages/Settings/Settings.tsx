import { Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const Settings = () => {
  const url = import.meta.env.VITE_API_URL;
  return (
    <div>
      <div className="bg-[#cedef2] p-4 inline-block">
        <h3 className="font-semibold">URL Link</h3>
        <p>Scan the QR code with your authenticator</p>
        <div className="p-10 flex items-center justify-center bg-white my-4">
          <QRCodeCanvas
            value={JSON.stringify(url)}
            title={"Link Account"}
            size={150}
          />
        </div>
        <p className="w-[22rem] mb-4">
          If you can’t scan the code,you can enter this secret code to your
          authentication app
        </p>
        <div className="px-4 py-2 bg-white w-full flex justify-between">
          <p>{JSON.stringify(url)}</p>
          <Copy className="cursor-pointer hover:text-red-500" />
        </div>
      </div>
    </div>
  );
};
export default Settings;
