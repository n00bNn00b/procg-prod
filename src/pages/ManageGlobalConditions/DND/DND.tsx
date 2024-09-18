import {
  closestCenter,
  DndContext,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableList from "./DraggableList";
import DroppableList, { DroppableItem } from "./DroppableList";
import { IManageGlobalConditionLogicExtendTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { FC, useEffect, useState } from "react";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
import ManageGlobalConditionUpdate from "../Update/ManageGlobalConditionUpdate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ring } from "ldrs";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "@/components/ui/use-toast";

const DND: FC = () => {
  const {
    isLoading,
    selectedManageGlobalConditionItem,
    fetchManageGlobalConditionLogics,
  } = useAACContext();
  const initialLeftWidget: IManageGlobalConditionLogicExtendTypes[] = [
    {
      id: 1,
      manage_global_condition_logic_id: 4,
      manage_global_condition_id:
        selectedManageGlobalConditionItem[0].manage_global_condition_id,
      object: "",
      attribute: "",
      condition: "",
      value: "",
      widget_position: 0,
      widget_state: 0,
    },
  ];
  const [leftWidgets, setLeftWidgets] =
    useState<IManageGlobalConditionLogicExtendTypes[]>(initialLeftWidget);
  const [rightWidgets, setRightWidgets] = useState<
    IManageGlobalConditionLogicExtendTypes[]
  >([]);
  console.log(rightWidgets);
  const [activeId, setActiveId] = useState<number | null>(null);
  useEffect(() => {
    const fetchDataFunc = async () => {
      const fetchData = await fetchManageGlobalConditionLogics(
        selectedManageGlobalConditionItem[0].manage_global_condition_id
      );
      setRightWidgets(fetchData as IManageGlobalConditionLogicExtendTypes[]);
    };
    fetchDataFunc();
  }, []);
  console.log(rightWidgets, "rightWidgets");
  //Top Form Start
  const FormSchema = z.object({
    name: z.string(),
    description: z.string(),
    datasource: z.string(),
    status: z.string().min(3, {
      message: "Select a option",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: selectedManageGlobalConditionItem[0].name ?? "",
      description: selectedManageGlobalConditionItem[0].description ?? "",
      datasource: selectedManageGlobalConditionItem[0].datasource ?? "",
      status: selectedManageGlobalConditionItem[0].status ?? "",
    },
  });
  const value = form.watch();
  //Top Form END
  ring.register(); // Default values shown

  //DND START
  //Active Item
  const leftWidget = leftWidgets.find(
    (item) => item.manage_global_condition_logic_id === activeId
  );
  const rightWidget = rightWidgets.find(
    (item) => item.manage_global_condition_logic_id === activeId
  );
  const newId = Math.max(
    ...rightWidgets.map((item) => item.manage_global_condition_logic_id)
  );
  const newItem = {
    id: 1,
    manage_global_condition_logic_id: newId + 1,
    manage_global_condition_id:
      selectedManageGlobalConditionItem[0].manage_global_condition_id,
    object: "",
    attribute: "",
    condition: "",
    value: "",
    widget_position: 0,
    widget_state: 0,
  };
  useEffect(() => {
    if (leftWidgets.length === 0) {
      setLeftWidgets((prev) => [...prev, newItem]);
    }
  }, [leftWidgets.length]);

  const activeItem = activeId ? leftWidget || rightWidget : null;
  const findEmptyInput = rightWidgets.filter(
    (item) =>
      item.object === "" ||
      item.attribute === "" ||
      item.condition === "" ||
      item.value === ""
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };
  const findContainer = (id: string | number): string | undefined => {
    if (
      leftWidgets.some((item) => item.manage_global_condition_logic_id === id)
    ) {
      return "left";
    }
    if (
      rightWidgets.some((item) => item.manage_global_condition_logic_id === id)
    ) {
      return "right";
    }
    return undefined;
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Find containers for active and over items
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    const activeItemId = active.id;
    const overItemId = over.id;

    // Ensure that leftEmptyWidget and users are arrays
    if (!Array.isArray(leftWidgets) || !Array.isArray(rightWidgets)) {
      console.error("Expected leftWidgets and users to be arrays");
      return;
    }

    const activeIndexInLeft = leftWidgets.findIndex(
      (item) => item.manage_global_condition_logic_id === activeItemId
    );
    // const activeIndexInRight = rightWidgets.findIndex(
    //   (item) => item.manage_global_condition_logic_id === activeItemId
    // );

    let newIndex = rightWidgets.length; // Default new index at end

    if (overItemId) {
      // Determine new index for the item being moved
      const overIndexInRight = rightWidgets.findIndex(
        (item) => item.manage_global_condition_logic_id === overItemId
      );
      newIndex =
        overIndexInRight === -1 ? rightWidgets.length : overIndexInRight;
    }

    if (findEmptyInput.length === 0) {
      if (activeContainer === "left" && overContainer === "right") {
        // Move item from leftEmptyWidget to users
        setRightWidgets((prev) => {
          const updatedRight = [...prev];
          const [movedItem] = leftWidgets.splice(activeIndexInLeft, 1);
          updatedRight.splice(newIndex, 0, movedItem);
          return updatedRight;
        });
      }
    } else if (findEmptyInput.length > 0) {
      toast({
        variant: "destructive",
        title: "Info",
        description: ` "warning", " Please fill in the empty input"`,
      });
    }
  };
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over) {
      const activeItemId = active.id;
      const overItemId = over.id;

      if (active.data.current?.sortable?.containerId === "right") {
        const oldIndex = rightWidgets.findIndex(
          (item) => item.manage_global_condition_logic_id === activeItemId
        );
        const newIndex = rightWidgets.findIndex(
          (item) => item.manage_global_condition_logic_id === overItemId
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          setRightWidgets(
            arrayMove(rightWidgets, oldIndex, newIndex).map((item, index) => ({
              ...item,
              widget_position: index,
            }))
          );
        }
      }
    }
  };
  console.log(rightWidgets);
  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        autoScroll
      >
        <div className="flex gap-1">
          <div className="w-1/3">
            <DraggableList id="left" items={leftWidgets} />
          </div>
          <div className="w-2/3">
            {/* Top Form */}
            <div className="px-4 pb-2">
              <ManageGlobalConditionUpdate form={form} />
            </div>
            <div>
              {isLoading ? (
                <div className="w-10 mx-auto mt-10">
                  <l-ring
                    size="40"
                    stroke="5"
                    bg-opacity="0"
                    speed="2"
                    color="black"
                  ></l-ring>
                </div>
              ) : (
                <DroppableList
                  id="right"
                  items={rightWidgets}
                  setItems={setRightWidgets}
                />
              )}
            </div>
          </div>
        </div>
        <DragOverlay>
          {activeItem ? (
            <DroppableItem
              item={activeItem}
              id={String(activeItem.manage_global_condition_logic_id)}
              items={
                leftWidgets.includes(activeItem) ? leftWidgets : rightWidgets
              }
              setItems={
                leftWidgets.includes(activeItem)
                  ? setLeftWidgets
                  : setRightWidgets
              }
              index={0}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
export default DND;
