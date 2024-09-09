import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import AccessPointsEntitle from "./AccessPointsEntitle/AccessPointsEntitle";
import ManageAccessEntitlementsTable from "./ManageAccessEntitlementsTable";
import CustomModal from "@/components/CustomModal/CustomModal";
import AccessPointsEntitleModal from "./AccessPointsEntitle/AccessPointsEntitleModal";
import { X } from "lucide-react";
import ManageAccessPointsEntitleModal from "./ManageAccessPointsEntitleModal";

const ManageAccessEntitlements = () => {
  const {
    editManageAccessEntitlement,
    setEditManageAccessEntitlement,
    isOpenModal,
    setIsOpenModal,
    selectedManageAccessEntitlements: selectedItem,
    mangeAccessEntitlementAction,
  } = useManageAccessEntitlementsContext();
  console.log(selectedItem);
  return (
    <div>
      <ManageAccessEntitlementsTable />
      <AccessPointsEntitle />
      <div>
        {editManageAccessEntitlement && (
          <CustomModal>
            <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
              <h2 className="text-lg font-bold">
                {mangeAccessEntitlementAction === "edit"
                  ? "Edit Manage Access Entitlements"
                  : "Add Access Entitlement"}
              </h2>
              <X
                onClick={() => {
                  setEditManageAccessEntitlement(false);
                }}
                className="cursor-pointer"
              />
            </div>
            {/* Card start */}
            <div className="p-2">
              <ManageAccessPointsEntitleModal selectedItem={selectedItem} />
            </div>
          </CustomModal>
        )}
      </div>
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
  );
};
export default ManageAccessEntitlements;
