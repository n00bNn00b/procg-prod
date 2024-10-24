import * as React from "react";
import { tailspin } from "ldrs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ChevronDown, Dot, FileEdit, Filter, Plus, Trash } from "lucide-react";

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

import { IManageAccessEntitlementsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import Pagination2 from "@/components/Pagination/Pagination2";
import columns from "./Columns";
const ManageAccessEntitlementsTable = () => {
  const {
    fetchManageAccessEntitlements,
    selected,
    setSelected,
    fetchAccessPointsEntitlement,
    setSelectedManageAccessEntitlements,
    setEditManageAccessEntitlement,
    save,
    setMangeAccessEntitlementAction,
    deleteManageAccessEntitlement,
    setTable,
    filteredData,
    setFilteredData,
  } = useManageAccessEntitlementsContext();
  const [data, setData] = React.useState<IManageAccessEntitlementsTypes[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // Fetch Data
  React.useEffect(() => {
    // if first time fetch empty array
    if (filteredData.length > 0) {
      setFilteredData([]);
    }
    setSelectedManageAccessEntitlements(Object());
    setSelected([]);
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchManageAccessEntitlements();
        setData(result ?? []);
      } catch (error) {
        console.error("Error fetching data sources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [save]);
  // loader
  tailspin.register();
  // Shadcn Form
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 3, //default page size
  });

  // select row
  const handleRowSelection = (rowData: IManageAccessEntitlementsTypes) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(rowData)) {
        // If the id is already selected, remove it
        return prevSelected.filter((selectedId) => selectedId !== rowData);
      } else {
        // If the id is not selected, add it
        return [...prevSelected, rowData];
      }
    });
  };
  const handleFetchAccessPoints = () => {
    fetchAccessPointsEntitlement(selected[0]);
    setSelectedManageAccessEntitlements(selected[0]);
  };

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
  const handleDelete = async () => {
    for (const element of selected) {
      await deleteManageAccessEntitlement(element.entitlement_id);
    }
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    setSelected([]);
  };
  // console.log(table.getRowModel().rows.map((row) => row.toggleSelected(false)));
  return (
    <div className="px-3">
      {/* top icon and columns*/}
      <div className="flex gap-3 items-center py-2">
        <div className="flex gap-3">
          <div className="flex gap-3 px-4 py-2 border rounded">
            <h3>actions</h3>
            <h3>view</h3>
          </div>
          <div className="flex gap-3 items-center px-4 py-2 border rounded">
            <div>
              {selected.length === 1 ? (
                <Filter
                  className="cursor-pointer hover:scale-110 duration-300"
                  onClick={handleFetchAccessPoints}
                />
              ) : (
                <Filter className="cursor-not-allowed text-slate-200" />
              )}
            </div>
            <div>
              {selected.length === 1 ? (
                <FileEdit
                  className="cursor-pointer hover:scale-110 duration-300"
                  onClick={() => {
                    setEditManageAccessEntitlement(true);
                    setSelectedManageAccessEntitlements(selected[0]);
                    setMangeAccessEntitlementAction("edit");
                    setTable(table);
                  }}
                />
              ) : (
                <FileEdit className="cursor-not-allowed text-slate-200" />
              )}
            </div>
            <div>
              <Plus
                className="cursor-pointer hover:scale-110 duration-300 text-green-500"
                onClick={() => {
                  setEditManageAccessEntitlement(true);
                  setSelectedManageAccessEntitlements(Object());
                  setFilteredData([]);
                  setSelected([]);
                  table
                    .getRowModel()
                    .rows.map((row) => row.toggleSelected(false));
                  setMangeAccessEntitlementAction("add");
                }}
              />
            </div>
            <div className="flex items-center">
              <AlertDialog>
                <AlertDialogTrigger disabled={selected.length === 0}>
                  <Trash
                    className={`hover:scale-110 duration-300 ${
                      selected.length === 0 || selected.length > 1
                        ? "text-slate-200 cursor-not-allowed"
                        : "text-red-500 cursor-pointer"
                    }`}
                    onClick={handleFetchAccessPoints}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span className="block">
                        {selected.map((item) => (
                          <span
                            className="block text-red-500"
                            key={item.entitlement_id}
                          >
                            <span className="block font-bold">
                              {item.entitlement_name}
                            </span>
                            <span>
                              {filteredData.map((item) => (
                                <span
                                  className=" flex items-center"
                                  key={item.access_point_id}
                                >
                                  <Dot />
                                  {item.element_name}
                                </span>
                              ))}
                            </span>
                          </span>
                        ))}
                      </span>
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
        </div>
        <Input
          placeholder="Filter Entitlement Name..."
          value={
            (table.getColumn("entitlement_name")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("entitlement_name")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm px-4 py-2"
        />
        {/* Columns */}
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
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border px-2 border-slate-400 bg-slate-200"
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
                            setTimeout(() => {
                              const selectedRows = table
                                .getSelectedRowModel()
                                .rows.map((row) => row.original);
                              console.log(selectedRows);
                              setSelected(selectedRows);
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
                  className=""
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id} className="border py-0 px-1">
                      {index === 0 ? (
                        <Checkbox
                          className="my-2"
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                            row.toggleSelected(!!value)
                          }
                          onClick={() => handleRowSelection(row.original)}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Pagination2 table={table} />
      </div>
      {/* Start Pagination */}
    </div>
  );
};
export default ManageAccessEntitlementsTable;
