import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Check, Trash, Trash2, X } from "lucide-react";
import TableRowCounter from "@/components/TableCounter/TableRowCounter";
import Spinner from "@/components/Spinner/Spinner";
import Pagination5 from "@/components/Pagination/Pagination5";
import { toast } from "@/components/ui/use-toast";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
interface RecycleBinTableProps {
  path: string;
  person: string;
}
const RecycleBinTable = ({ path, person }: RecycleBinTableProps) => {
  const { user } = useGlobalContext();
  const {
    isLoading,
    setIsLoading,
    currentPage,
    setCurrentPage,
    handleDeleteMessage,
    recycleBinMsg,
    setRecycleBinMsg,
    totalRecycleBinMsg,
  } = useSocketContext();
  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchRecycleBinMsg = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Message[]>(
          `${url}/messages/recyclebin/${user}/${currentPage}`
        );
        setRecycleBinMsg(response.data);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: `${error.message}}`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecycleBinMsg();
  }, [currentPage, setIsLoading, setRecycleBinMsg, url, user]);

  const totalDisplayedMessages = 5;
  const totalPageNumbers = Math.ceil(
    totalRecycleBinMsg / totalDisplayedMessages
  );
  let startNumber = 1;
  let endNumber = currentPage * totalDisplayedMessages;

  if (endNumber > totalRecycleBinMsg) {
    endNumber = totalRecycleBinMsg;
  }

  if (currentPage > 1) {
    const page = currentPage - 1;
    startNumber = page * totalDisplayedMessages + 1;
  }
  const convertDate = (isoDateString: Date) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
  const handleDelete = async (msg: Message) => {
    try {
      const holdersNumber = msg.holders?.length ?? 0;
      const recycleBinNumber = msg.recyclebin?.length ?? 0;
      if (holdersNumber > 0) {
        const response = await axios.put(
          `${url}/messages/remove-user-from-recyclebin/${msg.id}/${user}`
        );
        if (response.status === 200) {
          handleDeleteMessage(msg.id);
          toast({
            title: "Message has been deleted.",
          });
        }
      } else {
        if (recycleBinNumber > 1) {
          const response = await axios.put(
            `${url}/messages/remove-user-from-recyclebin/${msg.id}/${user}`
          );
          if (response.status === 200) {
            handleDeleteMessage(msg.id);
            toast({
              title: "Message has been deleted.",
            });
          }
        } else if (recycleBinNumber === 1) {
          const response = await axios.delete(`${url}/messages/${msg.id}`);
          if (response.status === 200) {
            handleDeleteMessage(msg.id);
            toast({
              title: "Message has been deleted.",
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: `${error.message}}`,
        });
      }
    }
  };
  const emptyRecycleBin = async () => {
    try {
      for (const msg of recycleBinMsg) {
        const holdersNumber = msg.holders?.length ?? 0;
        const recycleBinNumber = msg.recyclebin?.length ?? 0;
        if (holdersNumber > 0) {
          const response = await axios.put(
            `${url}/messages/remove-user-from-recyclebin/${msg.id}/${user}`
          );
          if (response.status === 200) {
            handleDeleteMessage(msg.id);
            toast({
              title: "Message has been deleted.",
            });
          }
        } else {
          if (recycleBinNumber > 1) {
            const response = await axios.put(
              `${url}/messages/remove-user-from-recyclebin/${msg.id}/${user}`
            );
            if (response.status === 200) {
              handleDeleteMessage(msg.id);
              toast({
                title: "Message has been deleted.",
              });
            }
          } else if (recycleBinNumber === 1) {
            const response = await axios.delete(`${url}/messages/${msg.id}`);
            if (response.status === 200) {
              handleDeleteMessage(msg.id);
              toast({
                title: "Message has been deleted.",
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };
  return (
    <>
      <div className="ml-[11rem] border rounded-md shadow-sm p-4 mb-4">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold mb-6 ">{path} </h1>
          <div>
            <AlertDialog>
              <AlertDialogTrigger
                className="bg-white text-white cursor-default"
                //     className="flex gap-1 bg-red-50 rounded p-2 items-center
                // justify-center hover:bg-red-500 hover:text-white duration-200
                // cursor-pointer"
              >
                <Trash /> <span>Empty Bin</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  from both side.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-Red-200 text-white flex justify-center items-center">
                    <X />
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-600 text-white flex justify-center items-center"
                    onClick={emptyRecycleBin}
                  >
                    <Check />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <TableRowCounter
            startNumber={startNumber}
            endNumber={endNumber}
            totalNumber={totalRecycleBinMsg}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-white hover:bg-white">
              <TableHead className="w-[7rem] font-bold">{person}</TableHead>
              <TableHead className="font-bold">Subject</TableHead>
              <TableHead className="w-[7rem] font-bold">Date</TableHead>
              <TableHead className="w-[5rem] font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody className="w-full">
              <TableRow>
                <TableCell className="flex flex-col items-center justify-center w-[50rem] h-[12rem]">
                  <Spinner size="80" color="#000000" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {recycleBinMsg.map((msg) => (
                <TableRow key={msg.id}>
                  <>
                    <TableCell className="py-2">
                      {msg.recivers.length === 0
                        ? "(no user)"
                        : msg.recivers.slice(0, 2).join(", ")}
                      {msg.recivers.length > 2 && ", ..."}
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="font-medium mr-1">
                        {msg.subject === "" ? "(no subject)" : msg.subject}
                      </span>
                      {/* <span className="text-dark-400 mr-1">
                      {msg.body?.slice(0, 60)}
                    </span>
                    <span>...</span> */}
                    </TableCell>
                    <TableCell className="w-[115px] py-2">
                      {convertDate(msg.date)}
                    </TableCell>
                    <TableCell className="flex gap-2 py-auto">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Trash2 color="#E60B0B" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete from both side.
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-Red-200 text-white flex justify-center items-center">
                              <X />
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-green-600 text-white flex justify-center items-center"
                              onClick={() => handleDelete(msg)}
                            >
                              <Check />
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <div className="flex w-full justify-end mt-4">
          <Pagination5
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPageNumbers={totalPageNumbers}
          />
        </div>
      </div>
    </>
  );
};
export default RecycleBinTable;
