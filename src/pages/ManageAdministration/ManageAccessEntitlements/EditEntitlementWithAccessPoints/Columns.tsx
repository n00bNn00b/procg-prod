import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { ICreateAccessPointsElementTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<ICreateAccessPointsElementTypes>[] = [
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
    accessorKey: "entitlement_name",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Entitlement Name
          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
        </div>
      );
    },
    cell: () => {
      const { selectedManageAccessEntitlements } =
        useManageAccessEntitlementsContext();
      return (
        <div className="capitalize">
          {selectedManageAccessEntitlements?.entitlement_name}
        </div>
      );
    },
  },
  {
    accessorKey: "element_name",
    header: "Element Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("element_name")}</div>
    ),
  },
  // {
  //   accessorKey: "Action",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     const { selected, deleteAccessEntitlementElement } =
  //       useManageAccessEntitlementsContext();
  //     const id = row?.original?.access_point_id;
  //     const handleRemoveAccessEntitlementElement = (id: number) => {
  //       deleteAccessEntitlementElement(selected[0].entitlement_id, id);
  //     };
  //     return (
  //       // <Button
  //       //   className="h-8"
  //       //   onClick={() => handleRemoveAccessEntitlementElement(id as number)}
  //       // >
  //       //   Remove
  //       // </Button>
  //       <AlertDialog>
  //         <AlertDialogTrigger asChild>
  //           <Button className="h-8">Remove</Button>
  //         </AlertDialogTrigger>
  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
  //             <AlertDialogDescription>
  //               This action cannot be undone. This will permanently delete your
  //               account and remove your data from our servers.
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           <AlertDialogFooter>
  //             <AlertDialogCancel>Cancel</AlertDialogCancel>
  //             <AlertDialogAction
  //               onClick={() =>
  //                 handleRemoveAccessEntitlementElement(id as number)
  //               }
  //             >
  //               Continue
  //             </AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     );
  //   },
  // },
];
export default columns;
