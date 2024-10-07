// import * as React from "react";
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
import {
  ArrowUpDown,
  ChevronDown,
  Dot,
  FileEdit,
  Plus,
  Trash,
} from "lucide-react";

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

import Pagination from "@/components/Pagination/Pagination";
import {
  IManageGlobalConditionLogicExtendTypes,
  IManageGlobalConditionTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";

import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
import { useEffect, useState } from "react";

const ManageGlobalConditionsTable = () => {
  const {
    isLoading,
    stateChange,
    setIsEditModalOpen,
    setIsOpenManageGlobalConditionModal,
    fetchManageGlobalConditions,
    manageGlobalConditions: data,
    selectedManageGlobalConditionItem,
    setSelectedManageGlobalConditionItem,
    fetchManageGlobalConditionLogics,
    setManageGlobalConditionTopicData,
    manageGlobalConditionDeleteCalculate,
    deleteManageGlobalCondition,
    deleteLogicAndAttributeData,
  } = useAACContext();
  // const [save, setSave] = useState<number>(0);
  // Fetch Data
  useEffect(() => {
    fetchManageGlobalConditions();
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    setSelectedManageGlobalConditionItem([]);
  }, [stateChange]);
  // loader
  tailspin.register();
  // Shadcn Form
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 7, //default page size
  });
  const [willBeDelete, setWillBeDelete] = useState<
    IManageGlobalConditionLogicExtendTypes[]
  >([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  // select row
  const handleRowSelection = (rowData: IManageGlobalConditionTypes) => {
    setSelectedManageGlobalConditionItem((prevSelected) => {
      if (prevSelected.includes(rowData)) {
        // If the id is already selected, remove it
        return prevSelected.filter((selectedId) => selectedId !== rowData);
      } else {
        // If the id is not selected, add it
        return [...prevSelected, rowData];
      }
    });
  };
  // const handleFetchAccessPoints = () => {
  //   fetchAccessPointsEntitlement(selectedManageGlobalConditionItem[0]);
  //   setSelectedManageAccessEntitlements(selectedManageGlobalConditionItem[0]);
  // };

  const columns: ColumnDef<IManageGlobalConditionTypes>[] = [
    {
      id: "select",
      header: ({ table }) => {
        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              setIsChecked(!isChecked);
            }}
            aria-label="Select all"
            className="pl-1 m-1"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name{" "}
            <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
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
      accessorKey: "status",
      header: "*Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
  ];
  //
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
  // handle delete Calculate
  const handleDeleteCalculate = async () => {
    const res = await manageGlobalConditionDeleteCalculate(
      selectedManageGlobalConditionItem[0].manage_global_condition_id
    );
    setWillBeDelete(res as IManageGlobalConditionLogicExtendTypes[]);
  };
  const handleDelete = async () => {
    await Promise.all(
      await willBeDelete.map(async (item) => {
        const res = await deleteLogicAndAttributeData(
          item.manage_global_condition_logic_id,
          item.id
        );
        console.log(res, item);
      })
    );
    // for (const item of willBeDelete) {
    //   await deleteLogicAndAttributeData(
    //     item.manage_global_condition_logic_id,
    //     item.id
    //   );
    // }
    await deleteManageGlobalCondition(
      selectedManageGlobalConditionItem[0].manage_global_condition_id
    );
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    setSelectedManageGlobalConditionItem([]);
    setWillBeDelete([]);
  };

  const handleEditClick = async () => {
    setIsEditModalOpen(true);
    const fetchData = await fetchManageGlobalConditionLogics(
      selectedManageGlobalConditionItem[0].manage_global_condition_id
    );
    setManageGlobalConditionTopicData(fetchData ?? []);
  };
  return (
    <div className="px-3">
      {/* top icon and columns*/}
      <div className="flex gap-3 items-center py-2">
        <div className="flex gap-3">
          <div className="flex gap-3 items-center px-4 py-2 border rounded">
            <div>
              {selectedManageGlobalConditionItem.length === 1 ? (
                <FileEdit
                  className="cursor-pointer"
                  onClick={handleEditClick}
                />
              ) : (
                <FileEdit className="cursor-not-allowed text-slate-200" />
              )}
            </div>
            <div>
              <Plus
                className="cursor-pointer"
                onClick={() => {
                  setIsOpenManageGlobalConditionModal(true);
                  // setEditManageAccessEntitlement(true);
                  // setSelectedManageAccessEntitlements(Object());
                  // setMangeAccessEntitlementAction("add");
                }}
              />
            </div>
            <div className="flex items-center">
              <AlertDialog>
                <AlertDialogTrigger
                  disabled={selectedManageGlobalConditionItem.length === 0}
                >
                  <Trash
                    onClick={handleDeleteCalculate}
                    className={`${
                      selectedManageGlobalConditionItem.length === 0 ||
                      selectedManageGlobalConditionItem.length > 1
                        ? "text-slate-200 cursor-not-allowed"
                        : "text-slate-800 cursor-pointer"
                    }`}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-500">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span>
                        <span>
                          NAME : {selectedManageGlobalConditionItem[0]?.name}
                        </span>
                        <br />
                        {willBeDelete.map((item) => (
                          <span
                            key={item.id}
                            className=" flex items-center text-red-500"
                          >
                            <Dot size={30} /> {item.object} {item.attribute}
                            {item.value}
                            {item.condition}
                          </span>
                        ))}
                      </span>
                      <span>
                        Note: This action cannot be undone. This will
                        permanently delete your account and remove your data
                        from our servers.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setWillBeDelete([])}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        <Input
          placeholder="Filter by Name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
        <Pagination table={table} />
      </div>
      {/* Start Pagination */}
    </div>
  );
};
export default ManageGlobalConditionsTable;
