import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import CustomModal from "@/components/CustomModal/CustomModal";

import AccessPointsEntitleModal from "./AccessPointsEntitleModal";
import AccessPointsEntitleTable from "./AccessPointsEntitleTable";
import { X } from "lucide-react";

const AccessPointsEntitle = () => {
  const {
    isOpenModal,
    setIsOpenModal,
    selected,
    fetchAccessPointsEntitlement,
  } = useManageAccessEntitlementsContext();
  console.log(isOpenModal);
  const handleClose = () => {
    setIsOpenModal(false);
    fetchAccessPointsEntitlement(selected[0]);
  };
  return (
    <div className="px-3">
      <div className="w-full">
        <AccessPointsEntitleTable />
        {/* Modal */}
        <div>
          {isOpenModal && (
            <CustomModal>
              <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
                <h2 className="text-lg font-bold text-red-500">
                  Create Access Points 11
                </h2>
                <X
                  color="red"
                  onClick={() => handleClose}
                  className="cursor-pointer"
                />
              </div>
              {/* Card start */}
              <div className="p-2">
                <AccessPointsEntitleModal />
              </div>
            </CustomModal>
          )}
        </div>
      </div>
    </div>
  );
};
export default AccessPointsEntitle;
// not working this file
