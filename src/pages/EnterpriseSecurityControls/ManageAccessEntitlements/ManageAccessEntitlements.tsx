import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import AccessPointsEntitle from "./AccessPointsTable/AccessPointsEntitle";
import ManageAccessEntitlementsTable from "./AccessEntitlementsTable/ManageAccessEntitlementsTable";
import CustomModal3 from "@/components/CustomModal/CustomModal3";
import { X } from "lucide-react";
import ManageAccessPointsEntitleModal from "./EditManageAccessEntitlement/ManageAccessPointsEntitleModal";
// import TestTable from "./testtable";

const ManageAccessEntitlements = () => {
  const {
    editManageAccessEntitlement,
    setEditManageAccessEntitlement,
    selectedManageAccessEntitlements: selectedItem,
    mangeAccessEntitlementAction,
  } = useManageAccessEntitlementsContext();
  return (
    <div>
      <ManageAccessEntitlementsTable />
      <AccessPointsEntitle />
      {/* Action Items */}
      <>
        {editManageAccessEntitlement && (
          <CustomModal3>
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
          </CustomModal3>
        )}
      </>
    </div>
  );
};
export default ManageAccessEntitlements;
