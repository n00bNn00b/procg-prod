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
import { IFetchAccessPointsEntitlementTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import Pagination from "@/components/Pagination/Pagination";

import { Button } from "@/components/ui/button";

const AccessPointsEntitleTable = () => {
  const {
    filteredData: data,
    isLoading,
    isOpenModal,
    setIsOpenModal,
    selectedManageAccessEntitlementsID,
  } = useManageAccessEntitlementsContext();

  const columns: ColumnDef<IFetchAccessPointsEntitlementTypes>[] = [
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
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("entitlement_name")}</div>
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

  console.log(selectedManageAccessEntitlementsID);
  return (
    <div className="px-3">
      <div className="w-full">
        <div className="flex items-center py-4">
          <div className="flex gap-2">
            <div className="px-4 py-2 border rounded shadow text-slate-300">
              <h3>Access Points</h3>
            </div>
            <div
              className={`px-4 py-2 border rounded shadow  ${
                selectedManageAccessEntitlementsID
                  ? "bg-slate-400  hover:shadow-md hover:bg-slate-500"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <button
                disabled={!selectedManageAccessEntitlementsID}
                onClick={() => setIsOpenModal(!isOpenModal)}
              >
                Create Access Point
              </button>
            </div>
            <div className="px-4 py-2 border rounded shadow text-slate-300">
              <h3>Delete</h3>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
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
        <div className="rounded-md border ">
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
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                            }
                            // onClick={() => handleRowSelection(row.original)}
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
