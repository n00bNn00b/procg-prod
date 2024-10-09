import { Button } from "@/components/ui/button";
import { IManageAccessModelsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<IManageAccessModelsTypes>[] = [
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
    accessorKey: "model_name",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model Name
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("model_name")}</div>
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "run_status",
    header: "Run Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("run_status")}</div>
    ),
  },
  {
    accessorKey: "last_run_date",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Run Date
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_run_date")}</div>
    ),
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created By
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("created_by")}</div>
    ),
  },
  {
    accessorKey: "last_updated_by",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated By
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_updated_by")}</div>
    ),
  },
  {
    accessorKey: "last_updated_date",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated Date
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_updated_date")}</div>
    ),
  },
  {
    accessorKey: "revision",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Revision
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("revision")}</div>
    ),
  },
  {
    accessorKey: "revision_date",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Revision Date
          <ArrowUpDown className="ml-2 h-4 w-4 hover:text-slate-800 cursor-pointer" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("revision_date")}</div>
    ),
  },
];
export default columns;
