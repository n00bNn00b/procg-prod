import * as React from "react";
import { tailspin } from "ldrs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";

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
import { IManageAccessEntitlementsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";

const ManageAccessEntitlementsTable = () => {
  const {
    fetchManageAccessEntitlements,
    selected,
    setSelected,
    fetchAccessPointsEntitlement,
  } = useManageAccessEntitlementsContext();
  const [data, setData] = React.useState<IManageAccessEntitlementsTypes[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [save, setSave] = React.useState<number>(0);
  // Fetch Data
  React.useEffect(() => {
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
    pageSize: 5, //default page size
  });

  const [isChecked, setIsChecked] = React.useState<boolean>(false);
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
    fetchAccessPointsEntitlement(selected[0].entitlement_id);
  };

  const columns: ColumnDef<IManageAccessEntitlementsTypes>[] = [
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onClick={() => handleRowSelection(row.original)}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "entitlement_id",
      header: "Entitlement ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("entitlement_id")}</div>
      ),
    },
    {
      accessorKey: "entitlement_name",
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            * Entitlement Name{" "}
            <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("entitlement_name")}</div>
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
      accessorKey: "comments",
      header: "Comments",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("comments")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "*Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "effective_date",
      header: "Effective Date",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("effective_date")}</div>
      ),
    },
    {
      accessorKey: "revison",
      header: "Revison",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("revison")}</div>
      ),
    },
    {
      accessorKey: "revision_date",
      header: "Revision Date",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("revision_date")}</div>
      ),
    },
    {
      accessorKey: "created_on",
      header: "Created On",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("created_on")}</div>
      ),
    },
    {
      accessorKey: "last_updated_on",
      header: "Last Updated On",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("last_updated_on")}</div>
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
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("created_by")}</div>
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

  const maxID =
    data.length > 0 ? Math.max(...data.map((item) => item.entitlement_id)) : 0;

  return (
    <div className="px-3">
      {/* top icon and columns*/}
      <div className="flex gap-3 items-center py-2">
        <div className="flex gap-3">
          <div className="flex gap-3 px-4 py-2 border rounded">
            <h3>actions</h3>
            <h3>view</h3>
          </div>
          <div className="flex gap-3 px-4 py-2 border rounded">
            {selected.length === 1 ? (
              <Filter
                className="cursor-pointer"
                onClick={handleFetchAccessPoints}
              />
            ) : (
              <Filter className="cursor-not-allowed text-slate-200" />
            )}
          </div>
        </div>
        <Input
          placeholder="Filter Datasource Name..."
          value={
            (table.getColumn("entitlement_name")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("datasource_name")
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
export default ManageAccessEntitlementsTable;
