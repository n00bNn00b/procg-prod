import {  IExecutionMethodsTypes } from "@/types/interfaces/ARM.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<IExecutionMethodsTypes>[] = [
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
    accessorKey: "execution_method",
    header: () => {
      return <div className="min-w-max">Execution Method</div>;
    },
    cell: ({ row }) => (
      <div className="min-w-max">{row.getValue("execution_method")}</div>
    ),
  },
  {
    accessorKey: "internal_execution_method",
    header: () => {
      return <div className="min-w-max">Internal Execution Method</div>;
    },
    cell: ({ row }) => <div>{row.getValue("internal_execution_method")}</div>,
  },
  {
    accessorKey: "executor",
    header: () => {
      return <div className="min-w-max">Execution</div>;
    },
    cell: ({ row }) => (
      <div className="">{row.getValue("executor")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => {
      return <div className="w-[15rem]">Description</div>;
    },
    cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
  }
];
export default columns;
