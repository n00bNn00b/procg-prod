import CustomModal2 from "@/components/CustomModal/CustomModal2";
import AccessPointsEditModal from "./AccessPointsEditModalTable";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { X } from "lucide-react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const AccessEntitlementElemantModal = () => {
  const { isOpenModal, setIsOpenModal } = useGlobalContext();
  const { selectedManageAccessEntitlements, setLimit, setPage } =
    useManageAccessEntitlementsContext();
  const handleCancel = () => {
    setIsOpenModal("");
    setLimit(5);
    setPage(1);
  };
  return (
    <div>
      {isOpenModal === "access_points" && (
        <CustomModal2>
          <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
            <h2 className="text-lg font-bold capitalize">
              Entitlement Name :{" "}
              {selectedManageAccessEntitlements?.entitlement_name}
            </h2>
            <X onClick={handleCancel} className="cursor-pointer" />
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
