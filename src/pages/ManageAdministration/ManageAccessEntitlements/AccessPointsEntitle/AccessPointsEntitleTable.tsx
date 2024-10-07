import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Check, ChevronDown, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  ICreateAccessPointsElementTypes,
  IFetchAccessPointsElementTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import Pagination from "@/components/Pagination/Pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

const AccessPointsEntitleTable = () => {
  const {
    filteredData: data,
    isLoading,
    isOpenModal,
    setIsOpenModal,
    selectedManageAccessEntitlements,
    deleteAccessPointsElement,
    fetchAccessPointsEntitlement,
  } = useManageAccessEntitlementsContext();
  const [selectedRow, setSelectedRow] = useState<
    ICreateAccessPointsElementTypes[]
  >([]);
  console.log(selectedRow);
  const columns: ColumnDef<IFetchAccessPointsElementTypes>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="py-1"
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  console.log(rowSelection, "rowSelection");
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const handleRowSelected = (rowData: ICreateAccessPointsElementTypes) => {
    setSelectedRow((prev) => {
      if (prev.includes(rowData)) {
        return prev.filter((item) => item !== rowData);
      } else {
        return [...prev, rowData];
      }
    });
  };
  const handleDelete = async () => {
    const res = await deleteAccessPointsElement(selectedRow[0]?.id || 0);
    table.getRowModel().rows.map((row) => row.toggleSelected(false));

    if (res === 200) {
      if (selectedManageAccessEntitlements) {
        fetchAccessPointsEntitlement(selectedManageAccessEntitlements);
      }
    }
  };
  console.log(selectedManageAccessEntitlements);
  return (
    <div className="">
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-2">
            <div className="px-4 py-2 border rounded shadow text-slate-300">
              <h3>Access Points</h3>
            </div>
            <div
              className={`px-4 py-2 border rounded shadow  ${
                selectedManageAccessEntitlements?.entitlement_id
                  ? "bg-slate-400  hover:shadow-md hover:bg-slate-500"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <button
                disabled={!selectedManageAccessEntitlements?.entitlement_id}
                onClick={() => setIsOpenModal(!isOpenModal)}
              >
                Create Access Point
              </button>
            </div>
            <div className="px-4 py-2 border rounded shadow ">
              <AlertDialog>
                <AlertDialogTrigger
                  className={`${
                    selectedRow.length > 1 ? "text-slate-300" : "text-slate-800"
                  } `}
                  disabled={selectedRow.length > 1}
                >
                  Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div>
            {selectedManageAccessEntitlements && (
              <h3 className="font-bold ">
                {selectedManageAccessEntitlements?.entitlement_name}
              </h3>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table className="">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="border border-slate-400 bg-slate-200 p-1 w-fit"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <l-tailspin
                      size="40"
                      stroke="5"
                      speed="0.9"
                      color="black"
                    ></l-tailspin>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id} className="border p-1 w-fit">
                        {index === 0 ? (
                          <Checkbox
                            className="m-1"
                            checked={row.getIsSelected() || false} // Ensure checked is always a boolean
                            onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                            }
                            onClick={() => handleRowSelected(row.original)}
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <l-tailspin
                      size="40"
                      stroke="5"
                      speed="0.9"
                      color="black"
                    ></l-tailspin>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found. Select Entitlement ID and filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination table={table} />
        </div>
      </div>
    </div>
  );
};
export default AccessPointsEntitleTable;
