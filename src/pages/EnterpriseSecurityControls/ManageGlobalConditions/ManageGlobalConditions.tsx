import ManageGlobalConditionsTable from "./ManageGlobalConditionsTable";
import { X } from "lucide-react";
import ManageGlobalConditionsModal from "./ManageGlobalConditionsModal";
import CustomModal2 from "@/components/CustomModal/CustomModal2";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
import CustomModal from "@/components/CustomModal/CustomModal";
// import DND from "./DND copy/DND";
import DND from "./DND/DND";

const ManageGlobalConditions = () => {
  const {
    isEditModalOpen,
    isOpenManageGlobalConditionModal,
    setIsOpenManageGlobalConditionModal,
  } = useAACContext();
  // console.log(isOpenManageGlobalConditionModal);
  return (
    <div>
      <ManageGlobalConditionsTable />
      <div>
        {isEditModalOpen && (
          <CustomModal2>
            {/* Card start */}
            <div className="h-full overflow-y-auto">
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
