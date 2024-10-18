import { IFetchAccessPointsElementTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X } from "lucide-react";

const columns: ColumnDef<IFetchAccessPointsElementTypes>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className=" "
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "element_name",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Element Name
          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("element_name")}</div>
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
    accessorKey: "datasource",
    header: "Datasource",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("datasource")}</div>
    ),
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("platform")}</div>
    ),
  },
  {
    accessorKey: "element_type",
    header: "Element Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("element_type")}</div>
    ),
  },
  {
    accessorKey: "access_control",
    header: "Access Control",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("access_control") === "true" ? <Check /> : <X />}
      </div>
    ),
  },
  {
    accessorKey: "change_control",
    header: "Change Control",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("change_control")}</div>
    ),
  },
  {
    accessorKey: "audit",
    header: "Audit",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("audit")}</div>
    ),
  },
];
export default columns;
