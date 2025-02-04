import { IARMViewRequestsTypes } from "@/types/interfaces/ARM.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<IARMViewRequestsTypes>[] = [
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
    accessorKey: "request_id",
    header: () => {
      return <div className="min-w-max">Request Id</div>;
    },
    cell: ({ row }) => <div>{row.getValue("request_id")}</div>,
  },
  {
    accessorKey: "task_name",
    header: () => {
      return <div className="min-w-max">Task Name</div>;
    },
    cell: ({ row }) => <div>{row.getValue("task_name")}</div>,
  },
  {
    accessorKey: "kwargs",
    header: () => {
      return <div className="min-w-max">Kwargs</div>;
    },
    cell: ({ row }) => {
      const data: string = JSON.stringify(row.getValue("kwargs"));
      return <div className="min-w-max">{data}</div>;
    },
  },
  {
    accessorKey: "schedule_name",
    header: () => {
      return <div className="min-w-max">Schedule Name</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("schedule_name")}</div>
    ),
  },
  {
    accessorKey: "schedule",
    header: () => {
      return <div className="min-w-max">Schedule</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("schedule")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => {
      return <div>Status</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "result",
    header: () => {
      return <div className="min-w-max">Result</div>;
    },
    cell: ({ row }) => (
      <div className="min-w-max">{row.getValue("result")}</div>
    ),
  },

  {
    accessorKey: "executor",
    header: () => {
      return <div className="min-w-max">Executor</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("executor")}</div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: () => {
      return <div className="min-w-max">Created On</div>;
    },
    cell: ({ row }) => {
      const data: string = row.getValue("timestamp");
      return <div className="capitalize  min-w-max">{data?.slice(0, 16)} </div>;
    },
  },
];
export default columns;
