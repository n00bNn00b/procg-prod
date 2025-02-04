import ManageGlobalConditionsTable from "./ManageGlobalConditionsTable";
import { X } from "lucide-react";
import ManageGlobalConditionsModal from "./ManageGlobalConditionsModal";
import CustomModal1 from "@/components/CustomModal/CustomModal1";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
import CustomModal3 from "@/components/CustomModal/CustomModal3";
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
          <CustomModal1>
            {/* Card start */}
            <div className="h-full overflow-y-auto">
              <DND />
            </div>
          </CustomModal1>
        )}
      </div>
      <div>
        {isOpenManageGlobalConditionModal && (
          <CustomModal3>
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
          </CustomModal3>
        )}
      </div>
    </div>
  );
};
export default ManageGlobalConditions;
