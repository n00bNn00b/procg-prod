import { IProfilesType } from "@/types/interfaces/users.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<IProfilesType>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "profile_type",
    header: "Profile Type",
    cell: ({ row }) => <div>{row.getValue("profile_type")}</div>,
  },
  {
    accessorKey: "profile_id",
    header: "profile_id",
    cell: ({ row }) => <div>{row.getValue("profile_id")}</div>,
  },
  {
    accessorKey: "primary_yn",
    header: () => {
      return <div className="w-5 text-center">Primary</div>;
    },
    cell: ({ row }) => {
      const primary: string = row.getValue("primary_yn");
      return (
        <div className="text-center">
          <input
            type="checkbox"
            checked={primary === "Y"}
            readOnly
            className="accent-black"
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
export default columns;
