import { IDataSourceTypes } from "@/types/interfaces/datasource.interface";
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
          className="min-w-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Element Name
          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="capitalize min-w-max">
          {row.getValue("element_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => {
      return <div className="capitalize min-w-[30rem]">Description</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "dataSource",
    header: () => {
      return <div className="capitalize min-w-max">Data Source</div>;
    },
    cell: ({ row }) => {
      const dataSource: IDataSourceTypes = row.getValue("dataSource");
      return (
        <div className="capitalize min-w-max">{dataSource.datasource_name}</div>
      );
    },
  },
  {
    accessorKey: "platform",
    header: () => {
      return <div className="capitalize min-w-max">Platform</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize min-w-max">{row.getValue("platform")}</div>
    ),
  },
  {
    accessorKey: "element_type",
    header: () => {
      return <div className="capitalize min-w-max">Element Type</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize min-w-max">{row.getValue("element_type")}</div>
    ),
  },
  {
    accessorKey: "access_control",
    header: () => {
      return <div className="capitalize min-w-max">Access Control</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize min-w-max">
        {row.getValue("access_control") === "true" ? <Check /> : <X />}
      </div>
    ),
  },
  {
    accessorKey: "change_control",
    header: () => {
      return <div className="capitalize min-w-max">Change Control</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize min-w-max">
        {row.getValue("change_control")}
      </div>
    ),
  },
  {
    accessorKey: "audit",
    header: () => {
      return <div className="capitalize min-w-max">Audit</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize min-w-max">{row.getValue("audit")}</div>
    ),
  },
];
export default columns;
