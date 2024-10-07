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
import { ChevronDown } from "lucide-react";

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
import { IManageLocalConditonsType } from "@/types/interfaces/ManageAccessEntitlements.interface";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const data: IManageLocalConditonsType[] = [
  {
    id: "m5gr84i4",
    instance: "EBSX",
    action: "Exclude",
    access_point_type: "Function",
    access_point: "Requisition Summary",
    from_access_point_type: "Responsibility",
    from_access_point: "ALK Procurement S",
    status: "Active",
    comments:
      "This is a read only function; as tested with Suzanne Lemay on 3/11/24",
  },
];

export const columns: ColumnDef<IManageLocalConditonsType>[] = [
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
    accessorKey: "instance",
    header: "Instance",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("instance")}</div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("action")}</div>
    ),
  },
  {
    accessorKey: "access_point_type",
    header: "Access Point Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("access_point_type")}</div>
    ),
  },
  {
    accessorKey: "access_point",
    header: "Access Point",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("access_point")}</div>
    ),
  },
  {
    accessorKey: "from_access_point_type",
    header: "From Access Point Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("from_access_point_type")}</div>
    ),
  },
  {
    accessorKey: "from_access_point",
    header: "From Access Point",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("from_access_point")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("comments")}</div>
    ),
  },
];

export function ManageLocalConditions() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Actions " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="delete">delete</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="View " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="a">A</SelectItem>
                <SelectItem value="b">B</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            Datasource{" "}
            <Select>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="EBSX " />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="edit">EBSA</SelectItem>
                  <SelectItem value="delete">EBSB</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
  );
}

export default ManageLocalConditions;
