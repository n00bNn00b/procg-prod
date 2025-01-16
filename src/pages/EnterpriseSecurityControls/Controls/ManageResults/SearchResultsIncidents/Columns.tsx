import { IControlsTypes } from "@/types/interfaces/manageControls.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<IControlsTypes>[] = [
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
    accessorKey: "control_name",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Control Name
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("control_name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "pending_results_count",
    header: "Pending Results Count",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("pending_results_count")}</div>
    ),
  },
  {
    accessorKey: "control_type",
    header: "Control Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("control_type")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("priority")}</div>
    ),
  },
  {
    accessorKey: "datasources",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Datasources
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("datasources")}</div>
    ),
  },
  {
    accessorKey: "control_last_run",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Control Last Run
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("control_last_run")}</div>
    ),
  },
  {
    accessorKey: "control_last_updated",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Control Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("control_last_updated")}</div>
    ),
  },
];
export default columns;
