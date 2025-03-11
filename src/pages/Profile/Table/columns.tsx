// import { Checkbox } from "@radix-ui/react-checkbox";
// import { ColumnDef } from "@tanstack/react-table";
// import { IProfilesType1 } from "./ProfileTable";

// const columns: ColumnDef<IProfilesType1>[] = [
//   {
//     id: "select",
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         className=" "
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "email_addresses",
//     header: "Profile ID",
//     cell: ({ row }) => {
//       const emails: string[] = row.getValue("email_addresses");
//       return (
//         <>
//           {emails?.map((email: string) => (
//             <div>{email}</div>
//           ))}
//         </>
//       );
//     },
//   },
// ];
// export default columns;
