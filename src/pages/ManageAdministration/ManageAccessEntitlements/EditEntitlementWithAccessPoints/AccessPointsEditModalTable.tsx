import * as React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import columns from "./Columns";
import RelationAccessPoint from "./RelationAccessPoint";
import Pagination3 from "@/components/Pagination/Pagination3";

const AccessPointsEditModal = () => {
  const {
    filteredData: data,
    isLoading,
    setSelectedAccessEntitlementElements,
    page,
    setPage,
    totalPage,
    currentPage,
    limit,
  } = useManageAccessEntitlementsContext();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 6, //default page size
  });
  React.useEffect(() => {
    // setLimit(10);
  }, [page, limit]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });
  const handleSelectItem = (accessPointIds: number) => {
    //set number of selected rows
    setSelectedAccessEntitlementElements((prev) => {
      if (prev.find((item) => item === accessPointIds)) {
        return prev.filter((item) => item !== accessPointIds);
      } else {
        return [...prev, accessPointIds];
      }
    });
  };
  const tableRow = () => {
    table.toggleAllPageRowsSelected(false);
  };
  return (
    <div className="">
      <div className="w-full">
        <div className="mb-4">
          <RelationAccessPoint tableRow={tableRow} />
        </div>
        <div className="rounded-md border">
          <Table>
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
                        {/* Example: Checkbox for selecting all rows */}
                        {header.id === "select" && (
                          <Checkbox
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
                                const ids = selectedRows.map(
                                  (row) => row?.access_point_id
                                );
                                setSelectedAccessEntitlementElements(
                                  ids as number[]
                                );
                              }, 0);
                            }}
                            className=""
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
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id} className="border p-1 w-fit">
                        {index === 0 ? (
                          <Checkbox
                            className=""
                            checked={row.getIsSelected() || false}
                            onCheckedChange={(value) => {
                              row.toggleSelected(!!value);
                            }}
                            onClick={() =>
                              handleSelectItem(
                                row.original.access_point_id as number
                              )
                            }
                            aria-label="Select row"
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
          <div>
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
    </div>
  );
};
export default AccessPointsEditModal;
