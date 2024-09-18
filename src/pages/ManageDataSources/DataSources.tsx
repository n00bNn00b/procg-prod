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
import {
  ArrowUpDown,
  ChevronDown,
  FilePlus2,
  Pencil,
  Trash,
} from "lucide-react";
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
import DataSourceDataAdd from "@/components/DataSourceDataAdd/DataSourceDataAdd";
import Pagination from "../../components/Pagination/Pagination";
import { IDataSourceTypes } from "@/types/interfaces/datasource.interface";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const DataSources = () => {
  const { fetchDataSources, deleteDataSource } = useGlobalContext();
  const [data, setData] = React.useState<IDataSourceTypes[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [save, setSave] = React.useState<number>(0);
  // Fetch Data
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchDataSources();
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

  const [selected, setSelected] = React.useState<IDataSourceTypes[]>([]);

  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  // select row
  const handleRowSelection = (rowData: IDataSourceTypes) => {
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

  // const handleInputChange = (id: number, field: string, value: string) => {
  //   setData((prevData) =>
  //     prevData.map((item) =>
  //       item.data_source_id === id ? { ...item, [field]: value } : item
  //     )
  //   );
  // };

  const columns: ColumnDef<IDataSourceTypes>[] = [
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
      accessorKey: "datasource_name",
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Datasource Name{" "}
            <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer inline-block" />
          </div>
        );
      },
      // header: "Datasource Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("datasource_name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize w-48">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "application_type",
      header: "Application Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("application_type")}</div>
      ),
    },
    {
      accessorKey: "application_type_version",
      header: "Application Type Version",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("application_type_version")}
        </div>
      ),
    },
    {
      accessorKey: "last_access_synchronization_date",
      header: "Last Access Synchronization Date",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("last_access_synchronization_date")}
        </div>
      ),
    },
    {
      accessorKey: "last_access_synchronization_status",
      header: "Last Access Synchronization Status",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("last_access_synchronization_status")}
        </div>
      ),
    },
    {
      accessorKey: "last_transaction_synchronization_date",
      header: "Last Transaction Synchronization Date",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("last_transaction_synchronization_date")}
        </div>
      ),
    },
    {
      accessorKey: "last_transaction_synchronization_status",
      header: "Last Transaction Synchronization Status",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("last_transaction_synchronization_status")}
        </div>
      ),
    },
    {
      accessorKey: "default_datasource",
      header: "Default Datasource",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("default_datasource")}</div>
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
  // Select for edit, delete
  React.useEffect(() => {
    setSelected(table.getSelectedRowModel().rows.map((row) => row.original));
  }, [table.getSelectedRowModel().rows]);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      setRowSelection({});
      // Iterate through the selected IDs and delete them one by one
      for (const data of selected) {
        await deleteDataSource(data.data_source_id);
      }
      // Update the `save` state to trigger data re-fetching
      setSave((prevSave) => prevSave + 1);
    } catch (error) {
      console.error("Error deleting data sources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxID =
    data.length > 0 ? Math.max(...data.map((item) => item.data_source_id)) : 0;

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
            <AlertDialog>
              <AlertDialogTrigger>
                <FilePlus2 className="cursor-pointer hover:text-green-500" />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-300">
                <AlertDialogHeader>
                  <AlertDialogTitle>Create Datasource</AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                  <DataSourceDataAdd
                    props="add"
                    maxID={maxID}
                    setSave={setSave}
                    selected={selected}
                    setRowSelection={setRowSelection}
                  />
                </div>
                <AlertDialogFooter></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger
                disabled={selected.length !== 1}
                className={`${
                  selected.length !== 1 && "text-slate-200 cursor-not-allowed"
                }`}
              >
                <Pencil
                  className={`${
                    selected.length === 1
                      ? "cursor-pointer text-sky-600"
                      : "cursor-not-allowed"
                  }`}
                />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-300">
                <AlertDialogHeader>
                  <AlertDialogTitle>Edit Datasource</AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                  <DataSourceDataAdd
                    props="update"
                    selected={selected}
                    editAble={true}
                    setSave={setSave}
                    setRowSelection={setRowSelection}
                  />
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger
                disabled={selected.length < 1}
                className={`${
                  selected.length < 1 && "text-slate-200 cursor-not-allowed"
                }`}
              >
                <Trash
                  className={`${
                    selected.length > 0
                      ? "cursor-pointer hover:text-red-600"
                      : "cursor-not-allowed"
                  }`}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers. You are
                    selected {selected.length}{" "}
                    {selected.length > 1 ? "rows" : "row"}. Data Source Name is
                    :{" "}
                    {selected.map((row, i) => (
                      <span
                        key={row.data_source_id}
                        className="flex flex-col text-red-600"
                      >
                        {i + 1}. {row.datasource_name}
                      </span>
                    ))}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  {isLoading ? (
                    <l-tailspin
                      size="40"
                      stroke="5"
                      speed="0.9"
                      color="black"
                    />
                  ) : (
                    <AlertDialogAction
                      className="bg-red-400 hover:bg-red-600"
                      onClick={handleDelete}
                    >
                      Continue
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Input
          placeholder="Filter Datasource Name..."
          value={
            (table.getColumn("datasource_name")?.getFilterValue() as string) ??
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
                      className="border border-slate-400 bg-slate-200"
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
                    <TableCell key={cell.id} className="border py-2">
                      {index === 0 ? (
                        <Checkbox
                          className="mr-2"
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
export default DataSources;
