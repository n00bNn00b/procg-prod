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
import { ChevronDown, FileEdit, PlusIcon, Trash } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import columns from "./Columns";
import CustomModal from "@/components/CustomModal/CustomModal";
import Pagination5 from "@/components/Pagination/Pagination5";
import { IARMTaskParametersTypes } from "@/types/interfaces/ARM.interface";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "@/components/ui/use-toast";
import { useARMContext } from "@/Context/ARMContext/ARMContext";
import TaskParametersModal from "../TaskParametersModal/TaskParametersModal";

export function TaskParametersTable() {
  const api = useAxiosPrivate();
  const { selectedTask, getTaskParameters, isSubmit } = useARMContext();
  const [data, setData] = React.useState<IARMTaskParametersTypes[] | []>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { page, setPage, totalPage, isOpenModal, setIsOpenModal } =
    useGlobalContext();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const [selectedRows, setSelectedRows] = React.useState<
    IARMTaskParametersTypes[]
  >([]);

  const handleRowSelection = (rowSelection: IARMTaskParametersTypes) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(rowSelection)) {
        return prevSelected.filter((item) => item !== rowSelection);
      } else {
        return [...prevSelected, rowSelection];
      }
    });
  };
  const handleRowsSelection = (data: IARMTaskParametersTypes[]) => {
    setSelectedRows((prev) => {
      const allSelected = data.every((row) =>
        prev.some(
          (selectedRow) => selectedRow.arm_param_id === row.arm_param_id
        )
      );
      if (allSelected) {
        return [];
      } else {
        return data;
      }
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (selectedTask === "") return setData([]);
      try {
        setIsLoading(true);
        const res = await getTaskParameters(selectedTask);
        if (res) setData(res);
      } catch (error) {
        // setData([]);
        console.log(error, "err");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedTask, isSubmit]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await Promise.all(
        selectedRows.map(async (item) => {
          await api.put(`/arm-tasks/cancel-task/${item.task_name}`);
        })
      );

      //table toggle empty
      table.getRowModel().rows.map((row) => row.toggleSelected(false));
      setSelectedRows([]);
      toast({
        title: "Info !!!",
        description: `Deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Info !!!",
        description: `Error : ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleOpenModal = (modelName: string) => {
    setIsOpenModal(modelName);
  };
  const handleCloseModal = () => {
    setIsOpenModal(""); // close modal
    setSelectedRows([]);
    //table toggle false
    table.toggleAllRowsSelected(false);
  };

  return (
    <div className="px-3">
      {selectedTask !== "" && isOpenModal === "add_task_params" ? (
        <CustomModal>
          <TaskParametersModal
            task_name="Add Task Params"
            selected={selectedRows}
            handleCloseModal={handleCloseModal}
          />
        </CustomModal>
      ) : (
        selectedTask !== "" &&
        isOpenModal === "update_task_params" && (
          <CustomModal>
            <TaskParametersModal
              task_name="Update Task Params"
              selected={selectedRows}
              handleCloseModal={handleCloseModal}
            />
          </CustomModal>
        )
      )}
      {/* top icon and columns*/}
      <div className="flex gap-3 items-center py-2">
        <div className="flex gap-3">
          <div className="flex gap-3 items-center px-4 py-2 border rounded">
            <div className="flex gap-3">
              <button>
                <PlusIcon
                  className={`${
                    selectedTask === ""
                      ? "text-slate-200 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handleOpenModal("add_task_params")}
                />
              </button>

              <button
                disabled={selectedRows.length > 1 || selectedRows.length === 0}
              >
                <FileEdit
                  className={`${
                    selectedRows.length > 1 || selectedRows.length === 0
                      ? "text-slate-200 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handleOpenModal("update_task_params")}
                />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button disabled={selectedRows.length === 0}>
                    <Trash
                      className={`${
                        selectedRows.length === 0
                          ? "cursor-not-allowed text-slate-200"
                          : "cursor-pointer"
                      }`}
                    />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {selectedRows.map((item, index) => (
                        <span
                          key={item.arm_param_id}
                          className="block text-red-500"
                        >
                          {index + 1}. user task name : {item.parameter_name}
                        </span>
                      ))}
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
          placeholder="Filter parameter Name"
          value={
            (table.getColumn("parameter_name")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("parameter_name")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm px-4 py-2"
        />
        <h3>{selectedTask.length > 0 && `Task Name : ${selectedTask}`}</h3>
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
        <div
        // className="h-[23rem]"
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="border border-slate-400 bg-slate-200 p-1 h-9"
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
                              const selectedRows = table
                                .getSelectedRowModel()
                                .rows.map((row) => row.original);
                              console.log(selectedRows, "aaaaaaaa");
                              handleRowsSelection(data);
                              // setSelected(selectedRows);
                            }}
                            className="mr-1"
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
                    className="h-[7rem] text-center"
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
                      <TableCell key={cell.id} className="border p-1 h-8">
                        {index === 0 ? (
                          <Checkbox
                            className=""
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
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
}
