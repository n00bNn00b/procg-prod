import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import CustomModal3 from "@/components/CustomModal/CustomModal3";

import AccessPointsEntitleModal from "./CreateAccessPointsEntitleModal";
import AccessPointsEntitleTable from "./AccessPointsEntitleTable";
import { X } from "lucide-react";
import AccessPointsEditModal from "../EditEntitlementWithAccessPoints/AccessPointsEditModalTable";
import CustomModal1 from "@/components/CustomModal/CustomModal1";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const AccessPointsEntitle = () => {
  const { isOpenModal, setIsOpenModal } = useGlobalContext();
  const { selectedManageAccessEntitlements } =
    useManageAccessEntitlementsContext();
  // const handleClose = () => {
  //   setIsOpenModal(false);
  //   fetchAccessPointsEntitlement(selected[0]);
  // };
  return (
    <div>
      <div>
        <AccessPointsEntitleTable />
        {/* Modal */}
        <div>
          {isOpenModal === "access_points" && (
            <CustomModal1>
              <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
                <h2 className="text-lg font-bold capitalize">
                  Entitlement Name :{" "}
                  {selectedManageAccessEntitlements?.entitlement_name}
                </h2>
                <X
                  onClick={() => {
                    setIsOpenModal("");
                  }}
                  className="cursor-pointer"
                />
              </div>
              {/* Card start */}
              <div className="p-2">
                <AccessPointsEditModal />
              </div>
            </CustomModal1>
          )}
        </div>
        <div>
          {isOpenModal === "create_access_point" && (
            <CustomModal3>
              <div className="flex justify-between p-2 bg-slate-300 rounded-t-lg">
                <h2 className="text-lg font-bold">Create Access Point</h2>
                <X
                  onClick={() => {
                    setIsOpenModal("");
                  }}
                  className="cursor-pointer"
                />
              </div>
              {/* Card start */}
              <div className="p-2">
                <AccessPointsEntitleModal />
              </div>
            </CustomModal3>
          )}
        </div>
      </div>
    </div>
  );
};
export default AccessPointsEntitle;
// not working this file
