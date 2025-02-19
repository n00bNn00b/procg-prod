import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { ChevronDown, FileEdit, PlusIcon } from "lucide-react";

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
import CustomModal3 from "@/components/CustomModal/CustomModal3";
import Pagination5 from "@/components/Pagination/Pagination5";
import { IARMTaskParametersTypes } from "@/types/interfaces/ARM.interface";
import { useARMContext } from "@/Context/ARMContext/ARMContext";
import TaskParametersModal from "../TaskParametersModal/TaskParametersModal";

export function TaskParametersTable() {
  const { totalPage2, selectedTask, getTaskParametersLazyLoading, isSubmit } =
    useARMContext();
  const [data, setData] = React.useState<IARMTaskParametersTypes[] | []>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isOpenModal, setIsOpenModal } = useGlobalContext();
  const [page, setPage] = React.useState<number>(1);
  const limit = 4;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
      if (!selectedTask?.user_task_name) return setData([]);
      try {
        setIsLoading(true);
        const res = await getTaskParametersLazyLoading(
          selectedTask.task_name,
          page,
          limit
        );

        if (res) setData(res);
      } catch (error) {
        // setData([]);
        console.log(error, "err");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedTask?.arm_task_id, isSubmit, page]);

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
  // default hidden columns
  const hiddenColumns = [
    "task_name",
    "created_by",
    "last_updated_by",
    "creation_date",
    "last_update_date",
  ];

  React.useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (hiddenColumns.includes(column.id)) {
        column.toggleVisibility(false);
      }
    });
  }, [table]);
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
      {selectedTask?.user_task_name && isOpenModal === "add_task_params" ? (
        <CustomModal3>
          <TaskParametersModal
            task_name="Add Parameter"
            selected={selectedRows[0]}
            handleCloseModal={handleCloseModal}
          />
        </CustomModal3>
      ) : (
        selectedTask?.user_task_name &&
        isOpenModal === "update_task_params" && (
          <CustomModal3>
            <TaskParametersModal
              task_name="Update Parameter"
              selected={selectedRows[0]}
              handleCloseModal={handleCloseModal}
            />
          </CustomModal3>
        )
      )}
      {/* top icon and columns*/}
      <div className="flex gap-3 items-center py-2">
        <div className="flex gap-3">
          <div className="flex gap-3 items-center px-4 py-2 border rounded">
            <div className="flex gap-3">
              <button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PlusIcon
                        className={`${
                          !selectedTask?.arm_task_id
                            ? "text-slate-200 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => handleOpenModal("add_task_params")}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add parameter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>

              <button
                disabled={selectedRows.length > 1 || selectedRows.length === 0}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FileEdit
                        className={`${
                          selectedRows.length > 1 || selectedRows.length === 0
                            ? "text-slate-200 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => handleOpenModal("update_task_params")}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Parameter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>
            </div>
          </div>
        </div>
        <Input
          placeholder="Filter Parameter Name"
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
        <h3 className="font-bold">
          {selectedTask?.arm_task_id &&
            `Selected : ${selectedTask?.user_task_name}`}
        </h3>
        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
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
            totalPageNumbers={totalPage2 as number}
          />
        </div>
      </div>
    </div>
  );
}
