import CustomModal1 from "@/components/CustomModal/CustomModal1";
import { FC } from "react";
import DND from "../ManageAccessModelDND/DND";
interface IManageAccessEditModelProps {
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenEditModal: boolean;
}
const EditModel: FC<IManageAccessEditModelProps> = ({
  setOpenEditModal,
  isOpenEditModal,
}) => {
  // const { selectedItem } = useAACContext();
  // console.log(selectedItem);
  return (
    <CustomModal1>
      <div className="h-full overflow-y-auto">
        <DND
          setOpenEditModal={setOpenEditModal}
          isOpenEditModal={isOpenEditModal}
        />
      </div>
    </CustomModal1>
  );
};
export default EditModel;
