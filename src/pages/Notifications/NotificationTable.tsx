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
import { Check, Trash, View, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import TableRowCounter from "@/components/TableCounter/TableRowCounter";
import Spinner from "@/components/Spinner/Spinner";
import Pagination5 from "@/components/Pagination/Pagination5";
import { useEffect, useState } from "react";
import { Message } from "@/types/interfaces/users.interface";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface NotificationTableProps {
  path: string;
  person: string;
}

const NotificationTable = ({ path, person }: NotificationTableProps) => {
  const api = useAxiosPrivate();
  const { user } = useGlobalContext();
  const {
    socketMessage,
    receivedMessages,
    setReceivedMessages,
    handleRead,
    handleDeleteMessage,
    totalReceivedMessages,
  } = useSocketContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Fetch Received Messages
  useEffect(() => {
    const fetchReceivedMessages = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Message[]>(
          `/messages/received/${user}/${currentPage}`
        );
        const result = response.data;
        setReceivedMessages(result);
      } catch (error) {
        console.log("Error fecth inbox messages.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceivedMessages();
  }, [currentPage, setIsLoading, setReceivedMessages, user, toast, api]);

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
    await api.put(`/messages/update-readers/${parentid}/${user}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.put(
        `/messages/set-user-into-recyclebin/${id}/${user}`
      );
      if (response.status === 200) {
        handleDeleteMessage(id);
        toast({
          title: "Message has been moved to recyclebin.",
        });
      }
    } catch (error) {
      console.log("Error when trying message moved to recyclebin.");
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
            startNumber={totalReceivedMessages > 0 ? startNumber : 0}
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
                <TableCell></TableCell>
                <TableCell className="flex items-center justify-center h-[12rem] py-32">
                  <Spinner size="80" color="#000000" />
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          ) : receivedMessages.length > 0 ? (
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
                            <p>Move to Recycle Bin</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell className="py-32 flex justify-center">
                  No messages found in Inbox Folder.
                </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <div className="flex w-full justify-end mt-4">
          <Pagination5
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPageNumbers={totalPageNumbers === 0 ? 1 : totalPageNumbers}
          />
        </div>
      </div>
    </>
  );
};

export default NotificationTable;
