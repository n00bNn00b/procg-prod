import {
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
import { ChevronDown } from "lucide-react";
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
import { useEffect, useState } from "react";
import { ICreateAccessPointsElementTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import columns from "./Columns";
import { Button } from "@/components/ui/button";
import Pagination3 from "@/components/Pagination/Pagination3";

const AccessPointsEntitleTable = () => {
  const {
    filteredData: data,
    isLoading,
    setIsOpenModal,
    selectedManageAccessEntitlements,
    fetchAccessPointsEntitlement,
    selected,
    save2,
    setSelectedRow,
    setAccessPointStatus,
    page,
    setPage,
    totalPage,
    currentPage,
    limit,
  } = useManageAccessEntitlementsContext();

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
  const handleRowSelected = (rowData: ICreateAccessPointsElementTypes) => {
    setSelectedRow((prev) => {
      if (prev.includes(rowData)) {
        return prev.filter((item) => item !== rowData);
      } else {
        return [...prev, rowData];
      }
    });
  };
  useEffect(() => {
    if (selected) {
      fetchAccessPointsEntitlement(selected[0]);
    }
    // setLimit(5);
  }, [save2, page, limit]);
  // const handleDelete = async () => {
  //   if (selectedRow.length > 0) {
  //     // const res = await deleteAccessPointsElement(
  //     //   selectedRow[0]?.access_point_id || 0
  //     // );
  //     for (const element of selectedRow) {
  //       deleteAccessEntitlementElement(
  //         selected[0]?.entitlement_id || 0,
  //         element?.access_point_id || 0
  //       );
  //     }

  //     table.getRowModel().rows.map((row) => row.toggleSelected(false));
  //     setSelectedRow([]);
  //     // if (selectedManageAccessEntitlements) {
  //     //   fetchAccessPointsEntitlement(selectedManageAccessEntitlements);
  //     // }
  //   }
  // };
  return (
    <div className="px-3">
      <div>
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-2">
            <div>
              <Button
                className="px-4 py-2 border rounded shadow"
                onClick={() => {
                  setIsOpenModal(3);
                  // setLimit(10);
                }}
                disabled={!selectedManageAccessEntitlements?.entitlement_id}
              >
                <h3>Access Points</h3>
              </Button>
            </div>
            <div>
              <Button
                onClick={() => {
                  setIsOpenModal(2);
                  setAccessPointStatus("create");
                }}
              >
                Create Access Point
              </Button>
            </div>
          </div>
          <div>
            {selectedManageAccessEntitlements && (
              <h3 className="font-bold capitalize">
                {selectedManageAccessEntitlements?.entitlement_id &&
                  "Entitlement Name : "}
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
          <div className="">
            <Table className="">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="border border-slate-400 bg-slate-200 py-0 px-1 h-9"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {/* Example: Checkbox for selecting all rows */}
                          {header.id === "select" && (
                            <Checkbox
                              className="m-1"
                              checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() &&
                                  "indeterminate")
                              }
                              onCheckedChange={(value) => {
                                // Toggle all page rows selected
                                table.toggleAllPageRowsSelected(!!value);

                                // Use a timeout to log the selected data
                                setTimeout(() => {
                                  const selectedRows = table
                                    .getSelectedRowModel()
                                    .rows.map((row) => row.original);
                                  // console.log(selectedRows);
                                  setSelectedRow(selectedRows);
                                }, 0);
                              }}
                              aria-label="Select all"
                            />
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
                      className="h-[8.8rem] text-center"
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
                        <TableCell
                          key={cell.id}
                          className="border py-0 px-1 h-7"
                        >
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
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[8.7rem] text-center"
                    >
                      No results found. Select Entitlement ID and filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination3
            setPage={setPage}
            page={page}
            totalPage={totalPage}
            table={table}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};
export default AccessPointsEntitleTable;
