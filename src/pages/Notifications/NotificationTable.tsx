import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import axios from "axios";
import { Check, Trash, View, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import TableRowCounter from "@/components/TableCounter/TableRowCounter";
import Spinner from "@/components/Spinner/Spinner";
import Pagination5 from "@/components/Pagination/Pagination5";
import { useEffect } from "react";
import { Message } from "@/types/interfaces/users.interface";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

interface NotificationTableProps {
  path: string;
  person: string;
}

const NotificationTable = ({ path, person }: NotificationTableProps) => {
  const { user } = useGlobalContext();
  const {
    isLoading,
    setIsLoading,
    socketMessage,
    receivedMessages,
    setReceivedMessages,
    handleRead,
    handleDeleteMessage,
    totalReceivedMessages,
    currentPage,
    setCurrentPage,
  } = useSocketContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  //Fetch Received Messages
  useEffect(() => {
    const fetchReceivedMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Message[]>(
          `${url}/messages/received/${user}/${currentPage}`
        );
        const result = response.data;
        setReceivedMessages(result);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: `${error.message}}`,
          });
        }
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceivedMessages();
  }, [currentPage, setIsLoading, setReceivedMessages, url, user, toast]);

  const totalDisplayedMessages = 5;
  const totalPageNumbers = Math.ceil(
    totalReceivedMessages / totalDisplayedMessages
  );

  let startNumber = 1;
  let endNumber = currentPage * totalDisplayedMessages;

  if (endNumber > totalReceivedMessages) {
    endNumber = totalReceivedMessages;
  }

  if (currentPage > 1) {
    const page = currentPage - 1;
    startNumber = page * totalDisplayedMessages + 1;
  }

  const uniquMessagesIds = socketMessage.map((msg) => msg.id);

  const handleUniqueMessages = async (parentid: string) => {
    navigate(`/notifications/inbox/${parentid}`);
    handleRead(parentid);
    await axios.put(`${url}/messages/update-readers/${parentid}/${user}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.put(
        `${url}/messages/set-user-into-recyclebin/${id}/${user}`
      );
      if (response.status === 200) {
        handleDeleteMessage(id);
        toast({
          title: "Message has been moved to recyclebin.",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: `${error.message}}`,
        });
      }
    }
  };

  const convertDate = (isoDateString: Date) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  return (
    <>
      <div className="ml-[11rem] border rounded-md shadow-sm p-4 mb-4">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold mb-6 ">{path}</h1>
          <TableRowCounter
            startNumber={startNumber}
            endNumber={endNumber}
            totalNumber={totalReceivedMessages}
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
              {receivedMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={
                    uniquMessagesIds.includes(msg.id)
                      ? "bg-winter-100/30"
                      : "mt-0"
                  }
                >
                  <>
                    <TableCell className="py-2">
                      {msg.sender.slice(0, 8)}
                      {msg.sender.length > 8 && "..."}
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="font-medium mr-1">{msg.subject}</span>
                      {/* <span className="text-dark-400 mr-1">
                      {msg.body?.slice(0, 60)}
                    </span>
                    <span>...</span> */}
                    </TableCell>
                    <TableCell className="py-2">
                      {convertDate(msg.date)}
                    </TableCell>
                    <TableCell className="flex gap-2 py-auto">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <View
                                onClick={() =>
                                  handleUniqueMessages(msg.parentid)
                                }
                                className="cursor-pointer"
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <Trash />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogDescription>
                                    This message will be displayed in the
                                    Recycle Bin.
                                  </AlertDialogDescription>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-Red-200 text-white flex justify-center items-center">
                                      <X />
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-green-600 text-white flex justify-center items-center"
                                      onClick={() => handleDelete(msg.id)}
                                    >
                                      <Check />
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Move to Recyclebin</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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

export default NotificationTable;
