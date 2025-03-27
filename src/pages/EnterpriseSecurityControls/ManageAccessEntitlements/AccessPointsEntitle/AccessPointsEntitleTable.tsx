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
import { ChevronDown, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Pagination5 from "@/components/Pagination/Pagination5";
import Spinner from "@/components/Spinner/Spinner";
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
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useLocation } from "react-router-dom";
import columns from "./Columns";

const AccessPointsEntitleTable = () => {
  // Global Context and Location
  const location = useLocation();
  const { setIsOpenModal } = useGlobalContext();
  const {
    filteredData: data,
    isLoadingAccessPoints,
    selectedManageAccessEntitlements,
    fetchAccessPointsEntitlement,
    selected,
    save2,
    setSelectedRow,
    setAccessPointStatus,
    page,
    setPage,
    totalPage,
    limit,
    isLoading,
  } = useManageAccessEntitlementsContext();

  // State Hooks
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Table Initialization
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
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  // Row selection handler
  const handleRowSelected = (rowData: ICreateAccessPointsElementTypes) => {
    setSelectedRow((prev) => {
      if (prev.includes(rowData)) {
        return prev.filter((item) => item !== rowData);
      } else {
        return [...prev, rowData];
      }
    });
  };

  // Effect: Fetch Data when relevant parameters change
  useEffect(() => {
    if (selected.length > 0) {
      fetchAccessPointsEntitlement(selected[0]);
    }
  }, [location, save2, page, limit, isLoadingAccessPoints]);

  // Effect: Manage Pagination Array based on selected state
  useEffect(() => {
    table.toggleAllRowsSelected(false); // Reset row selection
  }, [page, totalPage, selected.length]);

  // Table Rendering
  return (
    <div className="px-3">
      {/* Header Section */}
      <div className="flex items-center justify-between py-2">
        <div className="flex gap-2">
          {/* Access Points Button */}
          <Button
            className="px-4 py-2 rounded hover:shadow bg-white border text-black hover:bg-white"
            onClick={() => {
              setIsOpenModal("access_points");
              setPage(1);
            }}
            disabled={
              !selectedManageAccessEntitlements?.entitlement_id ||
              selected[0]?.entitlement_id !==
                selectedManageAccessEntitlements?.entitlement_id ||
              selected.length === 0
            }
          >
            <h3>Access Points</h3>
          </Button>

          {/* Create Access Point Button */}
          <Button
            className="bg-white border text-black hover:bg-white hover:shadow"
            onClick={() => {
              setIsOpenModal("create_access_point");
              setAccessPointStatus("create");
            }}
            disabled={
              !selectedManageAccessEntitlements?.entitlement_id ||
              selected[0]?.entitlement_id !==
                selectedManageAccessEntitlements?.entitlement_id ||
              selected.length === 0
            }
          >
            <Plus />
          </Button>
        </div>

        {/* Entitlement Name */}
        <div>
          {selectedManageAccessEntitlements?.entitlement_id ===
            selected[0]?.entitlement_id && (
            <h3 className="font-bold capitalize">
              {selectedManageAccessEntitlements?.entitlement_name}
            </h3>
          )}
        </div>

        {/* Dropdown for Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Section */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border bg-slate-200 py-0 px-1 h-9"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                    {/* Checkbox for selecting all rows */}
                    {header.id === "select" && (
                      <Checkbox
                        className="m-1"
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => {
                          table.toggleAllPageRowsSelected(!!value);
                          setTimeout(() => {
                            const selectedRows = table
                              .getSelectedRowModel()
                              .rows.map((row) => row.original);
                            setSelectedRow(selectedRows);
                          }, 0);
                        }}
                        aria-label="Select all"
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {isLoadingAccessPoints || (isLoading && selected.length === 1) ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[8.8rem] text-center"
                >
                  <Spinner color="black" size="40" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id} className="border py-0 px-1 h-7">
                      {index === 0 ? (
                        <Checkbox
                          className="m-1"
                          checked={row.getIsSelected() || false}
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

        {/* Pagination */}
        <div className="flex justify-between p-1">
          <div className="flex-1 text-sm text-gray-600">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <Pagination5
            currentPage={page}
            setCurrentPage={setPage}
            totalPageNumbers={totalPage as number}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessPointsEntitleTable;
