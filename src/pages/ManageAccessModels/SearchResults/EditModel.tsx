import CustomModal2 from "@/components/CustomModal/CustomModal2";
import { X } from "lucide-react";
import { FC } from "react";
interface IManageAccessEditModelProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditModel: FC<IManageAccessEditModelProps> = ({ setOpenModal }) => {
  // const { selectedItem } = useAACContext();
  // console.log(selectedItem);
  return (
    <CustomModal2>
      <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
        <h2 className="text-lg font-bold">Add Access Model</h2>
        <X
          onClick={() => {
            setOpenModal(false);
          }}
          className="cursor-pointer"
        />
      </div>
      <div className="p-2"></div>
    </CustomModal2>
  );
};
export default EditModel;
