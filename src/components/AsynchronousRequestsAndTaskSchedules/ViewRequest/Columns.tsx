import { IARMAsynchronousTasksTypes } from "@/types/interfaces/ARM.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<IARMAsynchronousTasksTypes>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "task_id",
    header: () => {
      return <div className="min-w-max">task_id</div>;
    },
    cell: ({ row }) => <div>{row.getValue("task_id")}</div>,
  },
  {
    accessorKey: "task_name",
    header: () => {
      return <div className="min-w-max">Task Name</div>;
    },
    cell: ({ row }) => <div>{row.getValue("task_name")}</div>,
  },
  {
    accessorKey: "status",
    header: () => {
      return <div className="min-w-max">status</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "args",
    header: () => {
      return <div className="w-[15rem]">args </div>;
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("args")}</div>,
  },
  {
    accessorKey: "result",
    header: () => {
      return <div className="min-w-max">result</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize w-[25rem]">{row.getValue("result")}</div>
    ),
  },
  {
    accessorKey: "schedule",
    header: () => {
      return <div className="min-w-max">schedule</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("schedule")}</div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: () => {
      return <div className="min-w-max">Created On</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("timestamp")}</div>
    ),
  },
];
export default columns;
