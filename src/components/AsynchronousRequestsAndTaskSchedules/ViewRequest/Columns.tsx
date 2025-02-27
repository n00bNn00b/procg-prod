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
    cell: ({ row }) => <div className="">{row.getValue("request_id")}</div>,
  },
  {
    accessorKey: "task_id",
    header: () => {
      return <div className="w-[20rem]">Task Id</div>;
    },
    cell: ({ row }) => (
      <div className="w-[20rem]">{row.getValue("task_id")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => {
      return <div>Status</div>;
    },
    cell: ({ row }) => <div className="">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "user_task_name",
    header: () => {
      return <div className="min-w-max">User Task Name</div>;
    },
    cell: ({ row }) => (
      <div className="min-w-max">{row.getValue("user_task_name")}</div>
    ),
  },
  {
    accessorKey: "task_name",
    header: () => {
      return <div className="min-w-max">Task Name</div>;
    },
    cell: ({ row }) => <div>{row.getValue("task_name")}</div>,
  },
  {
    accessorKey: "executor",
    header: () => {
      return <div className="min-w-max">Executor</div>;
    },
    cell: ({ row }) => <div className="">{row.getValue("executor")}</div>,
  },
  {
    accessorKey: "user_schedule_name",
    header: () => {
      return <div className="min-w-max">User Schedule Name</div>;
    },
    cell: ({ row }) => (
      <div className="min-w-max">{row.getValue("user_schedule_name")}</div>
    ),
  },
  {
    accessorKey: "redbeat_schedule_name",
    header: () => {
      return <div className="w-[20rem]">Redbeat Schedule Name</div>;
    },
    cell: ({ row }) => (
      <div className="w-[20rem]">{row.getValue("redbeat_schedule_name")}</div>
    ),
  },
  {
    accessorKey: "schedule",
    header: () => {
      return <div className="min-w-max">Schedule</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="min-w-max">
          {JSON.stringify(row.getValue("schedule"))}
        </div>
      );
    },
  },
  {
    accessorKey: "args",
    header: () => {
      return <div className="w-[30rem]">Args</div>;
    },

    cell: ({ row }) => {
      return (
        <div className="w-[30rem]">{JSON.stringify(row.getValue("args"))}</div>
      );
    },
  },
  {
    accessorKey: "kwargs",
    header: () => {
      return <div className="min-w-max">Kwargs</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="min-w-max">
          {JSON.stringify(row.getValue("kwargs"))}
        </div>
      );
    },
  },
  {
    accessorKey: "parameters",
    header: () => {
      return <div className="min-w-max">Parameters</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="min-w-max">
          {JSON.stringify(row.getValue("parameters"))}
        </div>
      );
    },
  },
  {
    accessorKey: "result",
    header: () => {
      return <div className="min-w-max">Result</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="min-w-max">
          {JSON.stringify(row.getValue("result"))}
        </div>
      );
    },
  },

  {
    accessorKey: "timestamp",
    header: () => {
      return <div className="min-w-max">Timestamp</div>;
    },
    cell: ({ row }) => {
      const data: string = row.getValue("timestamp");
      return <div className="min-w-max">{data} </div>;
    },
  },
];
export default columns;
