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
import { tailspin } from "ldrs";
tailspin.register();
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
import {
  IProfilesType,
  IUsersInfoTypes,
} from "@/types/interfaces/users.interface";
import Pagination5 from "@/components/Pagination/Pagination5";
import CreateAccessProfile from "@/pages/Profile/CreateAccessProfile/CreateAccessProfile";
import UpdateProfileIDModal from "@/pages/Profile/UpdateProfileIDModal/UpdateProfileIDModal";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
interface Props {
  profileData: IProfilesType[];
  isUpdated: number;
  setIsUpdated: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUsers: IUsersInfoTypes[];
  primaryCheckedItem: IProfilesType | undefined;
}
export function UserProfileTable({
  profileData,
  isUpdated,
  setIsUpdated,
  isLoading,
  setIsLoading,
  selectedUsers,
  primaryCheckedItem,
}: Props) {
  const api = useAxiosPrivate();
  const url = import.meta.env.VITE_API_URL;
  const { fetchCombinedUser, page, setPage, totalPage } = useGlobalContext();
  const [openModalName, setOpenModalName] = React.useState("");
  const [isCreateNewProfile, setIsCreateNewProfile] = React.useState(false);
  const [isUpdateProfile, setIsUpdateProfile] = React.useState(false);
  const [selectedProfile, setSelectedProfile] = React.useState<IProfilesType[]>(
    []
  );
  console.log(selectedProfile, "selectedProfile");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const displayOrder = ["Email", "Mobile Number", "GUID"];
  const data = profileData.sort(
    (a, b) =>
      displayOrder.indexOf(a.profile_type) -
      displayOrder.indexOf(b.profile_type)
  );

  React.useEffect(() => {
    fetchCombinedUser();
  }, []);
  React.useEffect(() => {
    if (page > 1 || page < totalPage) {
      fetchCombinedUser();
    }
  }, [page, totalPage]);

  React.useEffect(() => {
    handleCloseModal();
  }, [isUpdated]);

  const handleRowSelection = (rowSelection: IProfilesType) => {
    setSelectedProfile((prevSelected) => {
      if (prevSelected.includes(rowSelection)) {
        return prevSelected.filter((item) => item !== rowSelection);
      } else {
        return [...prevSelected, rowSelection];
      }
    });
  };

  const handleDelete = async () => {
    // deleteCombinedUser(selected);
    for (const element of selectedProfile) {
      try {
        const res = await api.delete(
          `${url}/access-profiles/${element.user_id}/${element.serial_number}`
        );
        if (res.status === 200) {
          toast({
            description: `${res.data.message}`,
          });
          setIsUpdated(Math.random() + 23 * 3000);
        }
      } catch (error) {
        console.log(error);
        toast({
          description: `Failed to delete`,
          variant: "destructive",
        });
      }
    }
    //table toggle empty
    table.getRowModel().rows.map((row) => row.toggleSelected(false));
    setSelectedProfile([]);
  };

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

  const handleOpenModal = (modelName: string) => {
    setOpenModalName(modelName);
    setIsCreateNewProfile(true);
    setIsUpdateProfile(true);
  };
  const handleCloseModal = () => {
    setOpenModalName(""); // close modal
    setSelectedProfile([]);
    //table toggle false
    table.toggleAllRowsSelected(false);
  };
  console.log(selectedProfile, "s");
  return (
    <div className="px-3">
      {openModalName === "create_user_profile" && isCreateNewProfile ? (
        <CreateAccessProfile
          setIsCreateNewProfile={setIsCreateNewProfile}
          setIsUpdated={setIsUpdated}
        />
      ) : (
        openModalName === "edit_user_profile" &&
        isUpdateProfile && (
          <UpdateProfileIDModal
            editableProfile={selectedProfile[0]}
            setIsOpenModal={setIsUpdateProfile}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsUpdated={setIsUpdated}
            primaryCheckedItem={primaryCheckedItem}
          />
        )
      )}
      {/* top icon and columns*/}
      <div className="flex gap-3 items-center py-2">
        <div className="flex gap-3">
          <div className="flex gap-3 items-center px-4 py-2 border rounded">
            <div className="flex gap-3">
              <PlusIcon
                className="cursor-pointer"
                onClick={() => handleOpenModal("create_user_profile")}
              />
              <button
                disabled={
                  selectedProfile.length > 1 || selectedProfile.length === 0
                }
              >
                <FileEdit
                  className={`${
                    selectedProfile.length > 1 || selectedProfile.length === 0
                      ? "text-slate-200 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handleOpenModal("edit_user_profile")}
                />
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={
                      // token.user_type !== "system" ||
                      selectedProfile.length === 0
                    }
                  >
                    <Trash
                      className={`${
                        // token.user_type !== "system" ||
                        selectedProfile.length === 0
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
                      {selectedProfile.map((item, index) => (
                        <span
                          key={item.serial_number}
                          className="block text-red-500"
                        >
                          {index + 1}. profile id : {item.profile_id}
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

        {/* Middle Selected User */}
        <div className="mx-auto">
          {selectedUsers.length === 1 && (
            <h3>
              Selected Username:{" "}
              <span className="font-semibold">
                {selectedUsers[0].user_name}
              </span>
            </h3>
          )}
        </div>
        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
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
        <div className="h-[10rem] overflow-y-auto ">
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
                              setTimeout(() => {
                                const selectedRows = table
                                  .getSelectedRowModel()
                                  .rows.map((row) => row.original);
                                console.log(selectedRows);
                                setSelectedProfile(selectedRows);
                              }, 0);
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
                      <TableCell
                        key={cell.id}
                        className={`border p-1 h-8 ${index === 0 && "w-3"}`}
                      >
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
            currentPage={1}
            setCurrentPage={setPage}
            totalPageNumbers={1}
          />
        </div>
      </div>
    </div>
  );
}
