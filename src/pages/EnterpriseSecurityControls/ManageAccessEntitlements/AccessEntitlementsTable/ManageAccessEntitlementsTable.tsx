import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { ChevronDown, Dot, FileEdit, Filter, Plus, Trash } from "lucide-react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Spinner from "@/components/Spinner/Spinner";
import Pagination5 from "@/components/Pagination/Pagination5";
import columns from "./Columns";
import {
  IFetchAccessPointsElementTypes,
  IManageAccessEntitlementsTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";

// Types for Delete
interface IDeleteAccessPointsElementTypes {
  entitlement_name: string;
  result: IFetchAccessPointsElementTypes[] | undefined;
}

// Main Component
const ManageAccessEntitlementsTable = () => {
  // Context Hooks
  const {
    save,
    setTable,
    setLimit,
    selected,
    setSelected,
    setFilteredData,
    fetchAccessPointsEntitlement,
    deleteManageAccessEntitlement,
    fetchManageAccessEntitlements,
    setEditManageAccessEntitlement,
    setMangeAccessEntitlementAction,
    setSelectedManageAccessEntitlements,
    fetchAccessPointsEntitlementForDelete,
    setPage: setAccessPointsPage,
    setTotalPage: setAccessPointsTotalPage,
  } = useManageAccessEntitlementsContext();

  // State Management
  const [data, setData] = React.useState<IManageAccessEntitlementsTypes[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number | undefined>(1);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // Shadcn Form State
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 3,
  });

  // Delete States
  const [deleteAccessPointsElement, setDeleteAccessPointsElement] =
    React.useState<IDeleteAccessPointsElementTypes[]>([]);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Effects
  React.useEffect(() => {
    setSelectedManageAccessEntitlements({} as IManageAccessEntitlementsTypes);
    return () => {
      setSelected([]);
      setFilteredData([]);
      setAccessPointsPage(1);
      setAccessPointsTotalPage(1);
    };
  }, []);

  React.useEffect(() => {
    setSelected([]);
    setFilteredData([]);
    setAccessPointsPage(1);
    setAccessPointsTotalPage(1);
    setSelectedManageAccessEntitlements({} as IManageAccessEntitlementsTypes);
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
  }, [selected.length > 1, page]);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const limit = 3;
      try {
        const result = await fetchManageAccessEntitlements(page, limit);
        setTotalPage(result?.totalPages);
        setCurrentPage(result?.currentPage ?? 1);
        setData(result?.results ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [save, page]);

  // Row Selection
  const handleRowSelection = (rowData: IManageAccessEntitlementsTypes) => {
    setSelected((prevSelected) =>
      prevSelected.includes(rowData)
        ? prevSelected.filter((selectedId) => selectedId !== rowData)
        : [...prevSelected, rowData]
    );
  };

  // Fetch Access Points
  const handleFetchAccessPoints = () => {
    setAccessPointsPage(1);
    fetchAccessPointsEntitlement(selected[0]);
    setSelectedManageAccessEntitlements(selected[0]);
    setLimit(5);
  };

  // Table Setup
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

  // Delete Handler
  const handleGenerateAccessPointsDelete = async () => {
    try {
      setDeleteLoading(true);
      for (const element of selected) {
        const result = await fetchAccessPointsEntitlementForDelete(element);
        setDeleteAccessPointsElement((prev) => [
          ...prev,
          { entitlement_name: element.entitlement_name, result },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDelete = async () => {
    for (const element of selected) {
      await deleteManageAccessEntitlement(element.entitlement_id);
    }
    table.getRowModel().rows.forEach((row) => row.toggleSelected(false));
    setSelected([]);
  };

  // Table Render
  return (
    <div className="px-3">
      {/* Top Actions */}
      <div className="flex gap-3 items-center py-2">
        <div className="flex gap-3">
          <div className="flex gap-3 px-4 py-2 border rounded">
            <h3>Actions</h3>
            <h3>View</h3>
          </div>
          <div className="flex gap-3 items-center px-4 py-2 border rounded">
            {selected.length === 1 ? (
              <Filter
                className="cursor-pointer hover:scale-110 duration-300"
                onClick={handleFetchAccessPoints}
              />
            ) : (
              <Filter className="cursor-not-allowed text-slate-200" />
            )}
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
            <Plus
              className="cursor-pointer hover:scale-110 duration-300 "
              onClick={() => {
                setEditManageAccessEntitlement(true);
                setSelectedManageAccessEntitlements(
                  {} as IManageAccessEntitlementsTypes
                );
                setFilteredData([]);
                setSelected([]);
                table
                  .getRowModel()
                  .rows.forEach((row) => row.toggleSelected(false));
                setMangeAccessEntitlementAction("add");
              }}
            />
            <div className="flex items-center">
              <AlertDialog>
                <AlertDialogTrigger disabled={selected.length === 0}>
                  <Trash
                    className={`hover:scale-110 duration-300 ${
                      selected.length > 0
                        ? " cursor-pointer"
                        : "text-slate-200 cursor-not-allowed"
                    }`}
                    onClick={handleGenerateAccessPointsDelete}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[80%] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="overflow-y-auto text-red-500">
                      <span className="flex flex-col gap-1">
                        {deleteLoading ? (
                          <span className="h-10 w-10 mx-auto p-2">
                            <l-tailspin
                              size="30"
                              stroke="5"
                              speed="0.9"
                              color="red"
                            />
                          </span>
                        ) : (
                          deleteAccessPointsElement.map((item, i) => (
                            <span key={item.entitlement_name}>
                              <span className="font-bold">
                                {i + 1}. {item.entitlement_name}
                              </span>
                              <span>
                                {item.result?.map((item) => (
                                  <span
                                    key={item.access_point_id}
                                    className="flex gap-1"
                                  >
                                    <Dot /> {item.element_name}
                                  </span>
                                ))}
                              </span>
                            </span>
                          ))
                        )}
                        {isLoading && <span>loading</span>}
                      </span>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setDeleteAccessPointsElement([])}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border h-9 py-0 px-1 border-slate-400 bg-slate-200"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                            setSelected(selectedRows);
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
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <Spinner color="black" size="40" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id} className="border py-0 px-1 h-7">
                      {index === 0 ? (
                        <Checkbox
                          className="m-1"
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[5rem] text-center"
                >
                  No results.
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
            currentPage={currentPage}
            setCurrentPage={setPage}
            totalPageNumbers={totalPage as number}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageAccessEntitlementsTable;
