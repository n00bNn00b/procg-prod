import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { IManageGlobalConditionLogicExtendTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";

interface DragOverlayComponentProps {
  item: IManageGlobalConditionLogicExtendTypes;
}

const DragOverlayComponent: React.FC<DragOverlayComponentProps> = ({
  item,
}) => {
  return (
    <DragOverlay>
      <div className="p-2 mb-2 bg-white border rounded shadow cursor-pointer">
        {item.object}
      </div>
    </DragOverlay>
  );
};

export default DragOverlayComponent;
