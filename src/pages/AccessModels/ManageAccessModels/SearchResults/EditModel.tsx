import CustomModal2 from "@/components/CustomModal/CustomModal2";
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
    <CustomModal2>
      <div className="h-full overflow-y-auto">
        <DND
          setOpenEditModal={setOpenEditModal}
          isOpenEditModal={isOpenEditModal}
        />
      </div>
    </CustomModal2>
  );
};
export default EditModel;
