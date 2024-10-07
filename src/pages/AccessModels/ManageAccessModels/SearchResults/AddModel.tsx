import CustomModal from "@/components/CustomModal/CustomModal";
import { X } from "lucide-react";
import { FC } from "react";
import AddForm from "./AddForm";
import { IManageAccessModelsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
interface IManageAccessModelProps {
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  items: IManageAccessModelsTypes[];
}
const AddModel: FC<IManageAccessModelProps> = ({ setOpenAddModal, items }) => {
  return (
    <CustomModal>
      <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
        <h2 className="text-lg font-bold">Add Access Model</h2>
        <X
          onClick={() => {
            setOpenAddModal(false);
          }}
          className="cursor-pointer"
        />
      </div>
      <div className="p-2">
        <AddForm items={items} />
      </div>
    </CustomModal>
  );
};
export default AddModel;
