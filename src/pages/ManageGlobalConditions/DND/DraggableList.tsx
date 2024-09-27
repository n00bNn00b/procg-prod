import { IManageGlobalConditionLogicExtendTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { FC } from "react";
import React, { CSSProperties } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface IDraggableListProps {
  id: string;
  items: IManageGlobalConditionLogicExtendTypes[];
}
const DraggableList: FC<IDraggableListProps> = ({ id, items }) => {
  return (
    <SortableContext
      id={id}
      items={items.map((widget) => widget.manage_global_condition_logic_id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="p-4 border rounded-lg">
        {items.map((item) => (
          <DraggableItem
            key={item.manage_global_condition_logic_id}
            id={item.manage_global_condition_logic_id.toString()}
            item={item}
          />
        ))}
      </div>
    </SortableContext>
  );
};

interface DraggableItemProps {
  id: string;
  item: IManageGlobalConditionLogicExtendTypes;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.manage_global_condition_logic_id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-300 shadow-lg border border-sky-500 rounded-lg cursor-pointer shadow-slate-400 hover:shadow-sky-500 hover:shadow-lg hover:duration-500"
    >
      <div className="flex justify-between bg-sky-500 rounded-t-lg py-1 px-2 items-center text-white">
        {item.manage_global_condition_logic_id}
      </div>
      <div className="p-3">
        <input
          readOnly
          autoComplete="on"
          type="text"
          className="rounded-lg w-full"
          id={String(item.manage_global_condition_logic_id)}
          name={String(item.manage_global_condition_logic_id)}
        />
      </div>
    </div>
  );
};
export default DraggableList;
