import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import AccessPointsEntitle from "./AccessPointsEntitle/AccessPointsEntitle";
import ManageAccessEntitlementsTable from "./ManageAccessEntitlementsTable";
import CustomModal from "@/components/CustomModal/CustomModal";
import { X } from "lucide-react";
import ManageAccessPointsEntitleModal from "./ManageAccessPointsEntitleModal";
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
      {/* <TestTable /> */}
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
    </div>
  );
};
export default ManageAccessEntitlements;
