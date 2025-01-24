import { IARMTypes } from "@/types/interfaces/ARM.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<IARMTypes>[] = [
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
    accessorKey: "user_task_name",
    header: () => {
      return <div className="min-w-max">User Task Name</div>;
    },
    cell: ({ row }) => <div>{row.getValue("user_task_name")}</div>,
  },
  {
    accessorKey: "task_name",
    header: () => {
      return <div className="min-w-max">Task Name</div>;
    },
    cell: ({ row }) => <div>{row.getValue("task_name")}</div>,
  },
  {
    accessorKey: "execution_method",
    header: () => {
      return <div className="min-w-max">Method</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("execution_method")}</div>
    ),
  },
  {
    accessorKey: "script_name",
    header: () => {
      return <div className="w-[15rem]">Script Name</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("script_name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => {
      return <div className="min-w-max">Description</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize w-[25rem]">{row.getValue("description")}</div>
    ),
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
    accessorKey: "last_updated_by",
    header: () => {
      return <div className="min-w-max">Last Updated By</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_updated_by")}</div>
    ),
  },
  {
    accessorKey: "creation_date",
    header: () => {
      return <div className="min-w-max">Creation Date</div>;
    },
    cell: ({ row }) => {
      const data: string = row.getValue("creation_date");
      return <div className="capitalize min-w-max">{data?.slice(0, 16)} </div>;
    },
  },
  {
    accessorKey: "last_update_date",
    header: () => {
      return <div className="min-w-max">Last Updated Date</div>;
    },
    cell: ({ row }) => {
      const data: string = row.getValue("last_update_date");
      return <div className="capitalize  min-w-max">{data?.slice(0, 16)} </div>;
    },
  },
  {
    accessorKey: "cancelled_yn",
    header: "Action",
    cell: ({ row }) => {
      const data: string = row.getValue("cancelled_yn");
      return (
        <div className="capitalize">{data === "Y" ? "Inactive" : "Active"}</div>
      );
    },
  },
];
export default columns;
