import { IManageAccessEntitlementsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<IManageAccessEntitlementsTypes>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          aria-label="Select all"
          className=" "
        />
      );
    },
    // cell: ({ row }) => (
    //   <Checkbox
    //     checked={row.getIsSelected()}
    //     // onClick={() => handleRowSelection(row.original)}
    //     onCheckedChange={(value) => row.toggleSelected(!!value)}
    //     aria-label="Select row"
    //   />
    // ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "entitlement_id",
    header: "Entitlement ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("entitlement_id")}</div>
    ),
  },
  {
    accessorKey: "entitlement_name",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          * Entitlement Name{" "}
          <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("entitlement_name")}</div>
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
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("comments")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "*Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "effective_date",
    header: "Effective Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("effective_date")}</div>
    ),
  },
  {
    accessorKey: "revison",
    header: "Revison",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("revison")}</div>
    ),
  },
  {
    accessorKey: "revision_date",
    header: "Revision Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("revision_date")}</div>
    ),
  },
  {
    accessorKey: "created_on",
    header: "Created On",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("created_on")}</div>
    ),
  },
  {
    accessorKey: "last_updated_on",
    header: "Last Updated On",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_updated_on")}</div>
    ),
  },
  {
    accessorKey: "last_updated_by",
    header: "Last Updated By",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_updated_by")}</div>
    ),
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("created_by")}</div>
    ),
  },
];
export default columns;
