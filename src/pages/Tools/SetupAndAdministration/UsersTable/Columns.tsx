import { IUsersInfoTypes } from "@/types/interfaces/users.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export const columns: ColumnDef<IUsersInfoTypes>[] = [
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
    accessorKey: "user_name",
    header: "User Name",
    cell: ({ row }) => <div>{row.getValue("user_name")}</div>,
  },

  {
    accessorKey: "email_addresses",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email Addresses
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const emailAddresses: Array<string> = row.getValue("email_addresses");
      const splitedEmailAddresses = emailAddresses.join(", ");
      return <div className="lowercase">{splitedEmailAddresses}</div>;
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("job_title")}</div>
    ),
  },
];
export default columns;
