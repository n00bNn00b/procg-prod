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

import {
  IFetchAccessPointsElementTypes,
  IManageAccessEntitlementsTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import columns from "./Columns";
import Pagination4 from "@/components/Pagination/Pagination4";
import Spinner from "@/components/Spinner/Spinner";
const ManageAccessEntitlementsTable = () => {
  const {
    fetchManageAccessEntitlements,
    selected,
    setSelected,
    fetchAccessPointsEntitlement,
    fetchAccessPointsEntitlementForDelete,
    setSelectedManageAccessEntitlements,
    setEditManageAccessEntitlement,
    save,
    setMangeAccessEntitlementAction,
    deleteManageAccessEntitlement,
    setTable,
    filteredData,
    setFilteredData,
    setLimit,
    setPage: setAccessPointsPage,
  } = useManageAccessEntitlementsContext();
  const [data, setData] = React.useState<IManageAccessEntitlementsTypes[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const limit = 3;
  const [totalPage, setTotalPage] = React.useState<number | undefined>();
  const [paginationArray, setPaginationArray] = React.useState<number[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  // Fetch Data
  React.useEffect(() => {
    // if first time fetch empty array
    if (filteredData.length > 0) {
      setFilteredData([]);
    }

    setSelected([]);
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchManageAccessEntitlements(page, limit);
        const num = result?.totalPages || 1;
        const array = [];
        for (let i = 1; i <= num; i++) {
          array.push(i);
        }
        setPaginationArray(array);
        setTotalPage(result?.totalPages);
        setCurrentPage(result?.currentPage ?? 1);
        setData(result?.results ?? []);
        if (selected.length === 0) {
          setPaginationArray([1]);
        }
      } catch (error) {
        console.error("Error fetching data sources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [save, page]);
  React.useEffect(() => {
    setSelectedManageAccessEntitlements(Object());
  }, []);

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
    // if first time fetch empty page
    setAccessPointsPage(1);
    fetchAccessPointsEntitlement(selected[0]);
    setSelectedManageAccessEntitlements(selected[0]);
    setLimit(5);
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
  interface IDeleteAccessPointsElementTypes {
    entitlement_name: string;
    result: IFetchAccessPointsElementTypes[] | undefined;
  }
  const [deleteAccessPointsElement, setDeleteAccessPointsElement] =
    React.useState<IDeleteAccessPointsElementTypes[]>([]);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const handleGenerateAccessPointsDelete = async () => {
    try {
      setDeleteLoading(true);
      for (const element of selected) {
        const result = await fetchAccessPointsEntitlementForDelete(element);
        // Instead of replacing the state, accumulate results
        setDeleteAccessPointsElement((prev) => [
          ...prev,
          {
            entitlement_name: element.entitlement_name,
            result,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleDelete = async () => {
    for (const element of selected) {
      await deleteManageAccessEntitlement(element.entitlement_id);
    }
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    setSelected([]);
  };
  React.useEffect(() => {
    //if seletect more than 1

    setSelectedManageAccessEntitlements(Object());
    setFilteredData([]);
  }, [selected.length > 1, page]);

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
                      selected.length > 0
                        ? "text-red-500 cursor-pointer"
                        : "text-slate-200 cursor-not-allowed"
                    }`}
                    onClick={handleGenerateAccessPointsDelete}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
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
                            ></l-tailspin>
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
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
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
        <div className="h-[8.5rem]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
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
                  <TableCell colSpan={columns.length} className=" text-center">
                    <Spinner color="black" size="40" />
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
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[8rem] w-10 mx-auto text-center p-0 m-0"
                  >
                    <l-tailspin
                      size="10"
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
                    className="h-[5rem] text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <Pagination3
          setPage={setPage}
          page={page}
          totalPage={totalPage}
          table={table}
          currentPage={currentPage}
        /> */}
        <div className="flex justify-between p-1">
          <div className="flex-1 text-sm text-gray-600">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <Pagination4
            currentPage={currentPage}
            setCurrentPage={setPage}
            totalPageNumbers={totalPage as number}
            paginationArray={paginationArray}
          />
        </div>
      </div>
      {/* Start Pagination */}
    </div>
  );
};
export default ManageAccessEntitlementsTable;
