import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, Dispatch, SetStateAction } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ArrowDown, Maximize, Minimize, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
export interface DroppableListProps {
  id: string;
  items: IManageGlobalConditionLogicExtendTypes[];
  originalData: IManageGlobalConditionLogicExtendTypes[];
  setItems: Dispatch<SetStateAction<IManageGlobalConditionLogicExtendTypes[]>>;
}
import { FC } from "react";
import { IManageGlobalConditionLogicExtendTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useDroppable } from "@dnd-kit/core";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";

const DroppableList: FC<DroppableListProps> = ({
  id,
  items,
  originalData,
  setItems,
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext
      id={id}
      items={items.map((item) => item.manage_global_condition_logic_id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        className="flex flex-col gap-2 p-4 "
        ref={items.length === 0 ? setNodeRef : null}
      >
        {items.length === 0 && (
          <p className="text-center font-semibold text-winter-500 p-9">
            Drop here
          </p>
        )}
        {items.map((item, index) => (
          <div key={item.manage_global_condition_logic_id}>
            <DroppableItem
              id={item.manage_global_condition_logic_id.toString()}
              item={item}
              items={items}
              originalData={originalData}
              index={index}
              setItems={setItems}
            />
            {/* Arrow Down Icon */}
            {items.map((item) => (
              <div key={item.manage_global_condition_logic_id}>
                <div className="w-3 mt-4 mx-auto"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SortableContext>
  );
};

interface DroppableItemProps {
  id: string;
  item: IManageGlobalConditionLogicExtendTypes;
  items: IManageGlobalConditionLogicExtendTypes[];
  originalData: IManageGlobalConditionLogicExtendTypes[];
  index: number;
  setItems: Dispatch<SetStateAction<IManageGlobalConditionLogicExtendTypes[]>>;
}

export const DroppableItem: FC<DroppableItemProps> = ({
  item,
  items,
  originalData,
  index,
  setItems,
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.manage_global_condition_logic_id });

  const { deleteLogicAndAttributeData } = useAACContext();

  // const { deleteUser } = useSqliteAuthContext();

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "grab",
  };

  const handleDelete = async (id: number, logicId: number, attrId: number) => {
    // check if logicId and attrId exist in the database

    const res = items.filter(
      (item) =>
        !originalData?.some(
          (ori) =>
            ori.manage_global_condition_logic_id ===
            item.manage_global_condition_logic_id
        )
    );
    if (res.length === 0) {
      // check if logicId and attrId exist in the database
      await deleteLogicAndAttributeData(logicId, attrId);
    }

    // delete Data from the array but not database
    const remainingUser = items.filter(
      (item) => item.manage_global_condition_logic_id !== id
    );
    setItems(remainingUser);
    toast({
      title: "Info !!!",
      description: "Delete data successfully.",
    });
  };

  const handleChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    // console.log(index, field, value);
    if (index !== undefined) {
      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    }
  };
  const maxPosition = Math.max(
    ...items.map(
      (data: IManageGlobalConditionLogicExtendTypes) => data.widget_position
    )
  );
  return (
    <div>
      <div
        style={style}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        className="bg-gray-300 shadow-lg border border-sky-500 rounded-lg cursor-pointer shadow-slate-400 hover:shadow-sky-500 hover:shadow-lg hover:duration-500"
      >
        <div className="flex justify-between bg-sky-500 rounded-t-lg px-2 text-white items-center">
          <span>{index}</span>
          <div className="flex text-xs duration-700">
            {item.widget_state === 1 ? (
              <Minimize
                size={30}
                onClick={() => handleChange(index, "widget_state", 0)}
                className="p-1 cursor-pointer hover:text-slate-800"
              />
            ) : (
              <Maximize
                size={30}
                onClick={() => handleChange(index, "widget_state", 1)}
                className="p-1 cursor-pointer hover:text-slate-800"
              />
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="hover:text-white rounded-md">
                  <Trash
                    size={30}
                    className="p-1 cursor-pointer hover:text-red-600"
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Really Want To <span className="text-red-600">Delete</span>{" "}
                    ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently{" "}
                    <span className="text-red-600">delete</span> from database
                    and <span className="text-red-600">remove</span> your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-sky-700 text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600"
                    onClick={() =>
                      handleDelete(
                        item.id,
                        item.manage_global_condition_logic_id,
                        item.id
                      )
                    }
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="p-3">
          {/* 1st row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col  ">
              <label htmlFor={`object-${index}`}>Object</label>
              <input
                className="px-2 rounded"
                type="text"
                id={`object-${index}`}
                name={`object-${index}`}
                value={item.object}
                onChange={(e) => handleChange(index, "object", e.target.value)}
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor={`attribute-${index}`}>Attribute</label>
              <input
                className="px-2 rounded"
                type="text"
                id={`attribute-${index}`}
                name={`attribute-${index}`}
                value={item.attribute}
                onChange={(e) =>
                  handleChange(index, "attribute", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor={`condition-${index}`}>Condition</label>
              <input
                className="px-2 rounded"
                type="text"
                id={`condition-${index}`}
                name={`condition-${index}`}
                value={item.condition}
                onChange={(e) =>
                  handleChange(index, "condition", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor={`value-${index}`}>Value</label>
              <input
                className="px-2 rounded"
                type="text"
                id={`value-${index}`}
                name={`value-${index}`}
                value={item.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
              />
            </div>
          </div>
          {/* 2nd row */}
          {item.widget_state === 1 && (
            <div
              className={`flex gap-3 my-1 ease-in ${
                item.widget_state === 1 ? "duration-700" : "duration-700"
              }`}
            >
              <h5 className="font-bold mt-2">Advance Option</h5>
              {/* <div className="flex flex-col w-[25%]">
              <label htmlFor={`user_name-${index}`}>User Name</label>
              <input
                className="px-2 rounded"
                type="text"
                id={`user_name-${index}`}
                name={`user_name-${index}`}
                value={item.}
                onChange={(e) =>
                  handleChange(index, "user_name", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col w-[25%]">
              <label htmlFor={`job_title-${index}`}>Job Title : </label>
              <select
                className="border rounded py-[1px]"
                name={`job_title-${index}`}
                id={`job_title-${index}`}
                value={item.job_title}
                onChange={(e) =>
                  handleChange(index, "job_title", e.target.value)
                }
              >
                <option>None</option>
                <option value="full_stack">Full Stack</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="ui_designer">UI Designer</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="flex flex-col w-[25%]">
              <label htmlFor={`user_type-${index}`}>User Type : </label>
              <select
                className="border rounded py-[1px]"
                name={`user_type-${index}`}
                id={`user_type-${index}`}
                value={item.user_type}
                onChange={(e) =>
                  handleChange(index, "user_type", e.target.value)
                }
              >
                <option>None</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="client">Client</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex flex-col w-[25%]">
              <label htmlFor={`tenant_id-${index}`}>Tenant Id : </label>
              <select
                className="border rounded py-[1px]"
                name={`tenant_id-${index}`}
                id={`tenant_id-${index}`}
                value={item.tenant_id}
                onChange={(e) =>
                  handleChange(index, "tenant_id", e.target.value)
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div> */}
            </div>
          )}
        </div>
      </div>
      <div className="w-6 mx-auto mt-6">
        <ArrowDown
          className={`${
            items.length > 1 && item.widget_position < maxPosition
              ? "visible"
              : "hidden"
          } `}
        />
      </div>
    </div>
  );
};

export default DroppableList;
