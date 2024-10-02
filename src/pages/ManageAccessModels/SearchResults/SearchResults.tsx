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
import { ArrowUpDown, ChevronDown, Dot, Edit, Plus, Trash } from "lucide-react";

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
import { IManageAccessModelsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
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
interface IManageAccessModelProps {
  items: IManageAccessModelsTypes[];
}
export const columns: ColumnDef<IManageAccessModelsTypes>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
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
      <div className="lowercase">{row.getValue("model_name")}</div>
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

const SearchResults: React.FC<IManageAccessModelProps> = ({ items: data }) => {
  const {
    selectedAccessModelItem,
    setSelectedAccessModelItem,
    deleteManageAccessModel,
  } = useAACContext();
  const [isOpenAddModal, setIsOpenAddModal] = React.useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);

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
    pageSize: 10, //default page size
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
  const handleDelete = () => {
    deleteManageAccessModel(selectedAccessModelItem);
    setSelectedAccessModelItem([]);
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
  };
  return (
    <div>
      <div className="w-full">
        {isOpenAddModal && (
          <AddModel items={data} setOpenModal={setIsOpenAddModal} />
        )}
        {isOpenEditModal && <EditModel setOpenModal={setIsOpenEditModal} />}

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
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Trash
                    className={`hover:scale-110 duration-300 cursor-pointer ${
                      selectedAccessModelItem.length > 0
                        ? "text-red-500 "
                        : "text-slate-200"
                    }`}
                  />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {selectedAccessModelItem.map((item) => (
                      <span
                        key={item.manage_access_model_id}
                        className="capitalize flex items-center text-red-500"
                      >
                        <Dot size={30} /> {item.model_name}
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
                      <TableHead key={header.id}>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id} className="py-2">
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
        <div className="flex items-center justify-end space-x-2 pt-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2 ">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchResults;
