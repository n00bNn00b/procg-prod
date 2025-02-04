import { IAsynchronousRequestsAndTaskSchedulesTypes } from "@/types/interfaces/ARM.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<IAsynchronousRequestsAndTaskSchedulesTypes>[] =
  [
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
      accessorKey: "user_schedule_name",
      header: () => {
        return <div className="min-w-max">User Schedule Name</div>;
      },
      cell: ({ row }) => <div>{row.getValue("user_schedule_name")}</div>,
    },
    {
      accessorKey: "redbeat_schedule_name",
      header: () => {
        return <div className="min-w-max">Redbeat Schedule Name</div>;
      },
      cell: ({ row }) => {
        const data: string = row.getValue("redbeat_schedule_name");
        return <div>{data === null ? "null" : data}</div>;
      },
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
        return <div>{data}</div>;
      },
    },
    {
      accessorKey: "schedule",
      header: () => {
        return <div className="min-w-max">Schedule Time</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("schedule")}</div>
      ),
    },
    {
      accessorKey: "args",
      header: () => {
        return <div className="w-[15rem]">Argument</div>;
      },
      cell: ({ row }) => {
        const args: Array<string> = row.getValue("args");
        return <div className="capitalize">{args[0]}</div>;
      },
    },
    {
      accessorKey: "created_by",
      header: () => {
        return <div className="min-w-max">Created By</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("created_by")}</div>
      ),
    },
    {
      accessorKey: "creation_date",
      header: () => {
        return <div className="min-w-max">Creation Date</div>;
      },
      cell: ({ row }) => {
        const data: string = row.getValue("creation_date");
        return (
          <div className="capitalize min-w-max">{data?.slice(0, 16)} </div>
        );
      },
    },
    {
      accessorKey: "last_updated_by",
      header: () => {
        return <div className="min-w-max">Last Updated By</div>;
      },
      cell: ({ row }) => {
        const data: string = row.getValue("last_updated_by");
        return <div>{data === null ? "null" : data}</div>;
      },
    },
    {
      accessorKey: "last_update_date",
      header: () => {
        return <div className="min-w-max">Last Updated Date</div>;
      },
      cell: ({ row }) => {
        const data: string = row.getValue("last_update_date");
        return (
          <div className="capitalize  min-w-max">{data?.slice(0, 16)} </div>
        );
      },
    },
    {
      accessorKey: "cancelled_yn",
      header: () => {
        return <div className="min-w-max">Cancelled</div>;
      },
      cell: ({ row }) => {
        const data: string = row.getValue("cancelled_yn");
        return <div className="capitalize  min-w-max">{data} </div>;
      },
    },
  ];
export default columns;
