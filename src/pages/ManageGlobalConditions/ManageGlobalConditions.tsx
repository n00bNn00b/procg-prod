import ManageGlobalConditionsTable from "./ManageGlobalConditionsTable";
import { FileEdit, X } from "lucide-react";
import ManageGlobalConditionsModal from "./ManageGlobalConditionsModal";
import CustomModal2 from "@/components/CustomModal/CustomModal2";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
import CustomModal from "@/components/CustomModal/CustomModal";
import DND from "./DND/DND";

const ManageGlobalConditions = () => {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    isOpenManageGlobalConditionModal,
    setIsOpenManageGlobalConditionModal,
  } = useAACContext();
  console.log(isOpenManageGlobalConditionModal);
  return (
    <div>
      <ManageGlobalConditionsTable />
      <div>
        {isEditModalOpen && (
          <CustomModal2>
            <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
              <h2 className="font-bold">Edit Access Global Conditions</h2>
              <div className="flex gap-2">
                <FileEdit className="cursor-pointer hover:text-green-600 hover:scale-110 duration-300" />
                <X
                  onClick={() => setIsEditModalOpen(!isEditModalOpen)}
                  className="cursor-pointer hover:text-red-600 hover:scale-125 duration-300"
                />
              </div>
            </div>
            {/* Card start */}
            <div className="p-2 h-[94%] overflow-y-auto">
              <DND />
            </div>
          </CustomModal2>
        )}
      </div>
      <div>
        {isOpenManageGlobalConditionModal && (
          <CustomModal>
            <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
              <h2 className="font-bold">Manage Global Condition</h2>
              <X
                onClick={() =>
                  setIsOpenManageGlobalConditionModal(
                    !isOpenManageGlobalConditionModal
                  )
                }
                className="cursor-pointer"
              />
            </div>
            {/* Card start */}
            <div className="p-2">
              <ManageGlobalConditionsModal />
            </div>
          </CustomModal>
        )}
      </div>
    </div>
  );
};
export default ManageGlobalConditions;
