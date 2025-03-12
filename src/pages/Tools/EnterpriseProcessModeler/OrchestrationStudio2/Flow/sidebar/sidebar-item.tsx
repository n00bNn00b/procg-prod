import { type DragEvent, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Shape from "../shape";
import { type ShapeType } from "../shape/types";

type SidebarItemProps = {
  type: ShapeType;
};

function SidebarItem({ type }: SidebarItemProps) {
  const dragImageRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer?.setData("application/reactflow", type);

    if (dragImageRef.current) {
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
  };
  const colorType = () => {
    switch (type) {
      case "Start":
        return "#549C30";
      case "round-rectangle":
        return "#3F8AE2";
      case "rectangle":
        return "#3F8AE2";
      case "hexagon":
        return "#3F8AE2";
      case "diamond":
        return "#3F8AE2";
      case "parallelogram":
        return "#3F8AE2";
      case "Stop":
        return "#FF0000";
      default:
        return "#3F8AE2";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button>
            <div className="sidebar-item" draggable onDragStart={onDragStart}>
              <Shape
                type={type}
                fill={colorType()}
                strokeWidth={1}
                width={28}
                height={28}
              />
              <div className="sidebar-item-drag-image" ref={dragImageRef}>
                <Shape
                  type={type}
                  width={80}
                  height={80}
                  fill={colorType()}
                  fillOpacity={0.7}
                  stroke={colorType()}
                  strokeWidth={2}
                />
              </div>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SidebarItem;
