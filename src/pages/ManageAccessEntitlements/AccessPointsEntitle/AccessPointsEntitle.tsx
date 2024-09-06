import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import CustomModal from "@/components/CustomModal/CustomModal";

import AccessPointsEntitleModal from "./AccessPointsEntitleModal";
import AccessPointsEntitleTable from "./AccessPointsEntitleTable";
import { X } from "lucide-react";

const AccessPointsEntitle = () => {
  const { isOpenModal, setIsOpenModal } = useManageAccessEntitlementsContext();
  return (
    <div className="px-3">
      <div className="w-full">
        <AccessPointsEntitleTable />
        {/* Modal */}
        <div>
          {isOpenModal && (
            <CustomModal>
              <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
                <h2 className="text-lg font-bold">Create Access Points</h2>
                <X
                  onClick={() => setIsOpenModal(false)}
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
