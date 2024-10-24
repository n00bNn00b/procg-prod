import CustomModal2 from "@/components/CustomModal/CustomModal2";
import AccessPointsEditModal from "./AccessPointsEditModalTable";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { X } from "lucide-react";

const AccessEntitlementElemantModal = () => {
  const { isOpenModal, setIsOpenModal, selectedManageAccessEntitlements } =
    useManageAccessEntitlementsContext();
  return (
    <div>
      {isOpenModal === 3 && (
        <CustomModal2>
          <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
            <h2 className="text-lg font-bold capitalize">
              Entitlement Name :{" "}
              {selectedManageAccessEntitlements?.entitlement_name}
            </h2>
            <X
              onClick={() => {
                setIsOpenModal(0);
              }}
              className="cursor-pointer"
            />
          </div>
          {/* Card start */}
          <div className="p-2">
            <AccessPointsEditModal />
          </div>
        </CustomModal2>
      )}
    </div>
  );
};
export default AccessEntitlementElemantModal;
