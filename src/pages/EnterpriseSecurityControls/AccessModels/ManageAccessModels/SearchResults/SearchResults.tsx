import * as React from "react";
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
import { ArrowUpDown, ChevronDown, Edit, Plus, Trash } from "lucide-react";

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
import {
  IManageAccessModelLogicExtendTypes,
  IManageAccessModelsTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import AddModel from "./AddModel";
import EditModel from "./EditModel";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
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
import { ring } from "ldrs";
import Pagination from "@/components/Pagination/Pagination";
interface IManageAccessModelProps {
  // items: IManageAccessModelsTypes[];
}
export const columns: ColumnDef<IManageAccessModelsTypes>[] = [
  {
    id: "select",

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "model_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("model_name")}</div>
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "run_status",
    header: "Run Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("run_status")}</div>
    ),
  },
  {
    accessorKey: "last_run_date",
    header: "Last Run Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_run_date")}</div>
    ),
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("created_by")}</div>
    ),
  },
  {
    accessorKey: "last_updated_by",
    header: "Last Updated By",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_updated_by")}</div>
    ),
  },
  {
    accessorKey: "last_updated_date",
    header: "Last Updated Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_updated_date")}</div>
    ),
  },
  {
    accessorKey: "revision",
    header: "Revision",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("revision")}</div>
    ),
  },
  {
    accessorKey: "revision_date",
    header: "Revision Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("revision_date")}</div>
    ),
  },
];

const SearchResults: React.FC<IManageAccessModelProps> = () => {
  const {
    isLoading,
    selectedAccessModelItem,
    setSelectedAccessModelItem,
    stateChange,
    fetchManageAccessModels,
    manageAccessModels: data,
    deleteManageAccessModel,
    manageAccessModelLogicsDeleteCalculate,
    deleteManageModelLogicAndAttributeData,
  } = useAACContext();
  React.useEffect(() => {
    fetchManageAccessModels();
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    setSelectedAccessModelItem([]);
  }, [stateChange]);
  // const data = manageAccessModels ? [...manageAccessModels] : [];
  ring.register();
  const [isOpenAddModal, setIsOpenAddModal] = React.useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);
  const [willBeDelete, setWillBeDelete] = React.useState<
    IManageAccessModelLogicExtendTypes[]
  >([]);

  // form
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
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
  const handleRowSelection = (rowData: IManageAccessModelsTypes) => {
    setSelectedAccessModelItem((prevSelected) => {
      if (prevSelected.includes(rowData)) {
        // If the id is already selected, remove it
        return prevSelected.filter((selectedId) => selectedId !== rowData);
      } else {
        // If the id is not selected, add it
        return [...prevSelected, rowData];
      }
    });
  };
  const handleDeleteCalculate = async () => {
    const results: IManageAccessModelLogicExtendTypes[] = [];

    try {
      const deletePromises = selectedAccessModelItem.map((item) =>
        manageAccessModelLogicsDeleteCalculate(item.manage_access_model_id)
      );

      const responses = await Promise.all(deletePromises);

      responses.forEach((res) => {
        if (Array.isArray(res)) {
          results.push(...res);
        } else if (res) {
          results.push(res);
        }
      });
      setWillBeDelete((prev) => [...prev, ...results]);
    } catch (error) {
      console.error("Error deleting access model items:", error);
    }
  };

  const handleDelete = async () => {
    await Promise.all(
      await willBeDelete.map(async (item) => {
        await deleteManageModelLogicAndAttributeData(
          item.manage_access_model_logic_id,
          item.id
        );
      })
    );
    await deleteManageAccessModel(selectedAccessModelItem);
    setSelectedAccessModelItem([]);
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    setSelectedAccessModelItem([]);
    setWillBeDelete([]);
  };
  return (
    <div>
      <div className="w-full">
        {isOpenAddModal && (
          <AddModel items={data} setOpenAddModal={setIsOpenAddModal} />
        )}
        {isOpenEditModal && (
          <EditModel
            setOpenEditModal={setIsOpenEditModal}
            isOpenEditModal={isOpenEditModal}
          />
        )}

        <div className="flex items-center py-4">
          <div className="flex gap-2 items-center mx-2 border p-1 rounded-md">
            <Plus
              onClick={() => setIsOpenAddModal(true)}
              className="hover:scale-110 duration-300 hover:text-green-500 cursor-pointer"
            />

            <Edit
              onClick={() =>
                selectedAccessModelItem.length > 0 && setIsOpenEditModal(true)
              }
              className={`hover:scale-110 duration-300 cursor-pointer ${
                selectedAccessModelItem.length === 1
                  ? "text-green-500 "
                  : "text-slate-200"
              }`}
            />
            <AlertDialog>
              <AlertDialogTrigger
                disabled={selectedAccessModelItem.length === 0}
              >
                <Trash
                  onClick={handleDeleteCalculate}
                  className={`hover:scale-110 duration-300 ${
                    selectedAccessModelItem.length === 0
                      ? "text-slate-200 cursor-not-allowed"
                      : "text-red-500 cursor-pointer"
                  }`}
                />
              </AlertDialogTrigger>

              <AlertDialogContent className="overflow-y-auto max-h-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-red-500">
                    {selectedAccessModelItem.map((modelItem) => (
                      <span key={modelItem.manage_access_model_id}>
                        <span className="capitalize mt-3 font-bold block">
                          ACCESS_MODEL_NAME : {modelItem.model_name}
                        </span>
                        <span>
                          {isLoading ? (
                            <span className="block">
                              <l-tailspin
                                size="40"
                                stroke="5"
                                speed="0.9"
                                color="black"
                              ></l-tailspin>
                            </span>
                          ) : (
                            <span>
                              {willBeDelete
                                .filter(
                                  (item) =>
                                    item.manage_access_model_id ===
                                    modelItem.manage_access_model_id
                                )
                                .map((item, index) => (
                                  <span
                                    key={index}
                                    className="capitalize flex items-center text-red-500"
                                  >
                                    {index + 1}. Object - {item.object},
                                    Attribute - {item.attribute}
                                  </span>
                                ))}
                            </span>
                          )}
                        </span>
                      </span>
                    ))}
                    <span className="block mt-3 text-neutral-500">
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sticky -bottom-2 right-0 mt-4">
                  <AlertDialogCancel onClick={() => setWillBeDelete([])}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Input
            placeholder="Filter by model name..."
            value={
              (table.getColumn("model_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("model_name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm h-8"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-8">
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
                                setSelectedAccessModelItem(selectedRows);
                              }, 0);
                            }}
                            className="m-1"
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
        </div>
        {/* Start Pagination */}
        <Pagination table={table} />
      </div>
    </div>
  );
};
export default SearchResults;
