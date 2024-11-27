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
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Check, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableRowCounter from "@/components/TableCounter/TableRowCounter";
import Spinner from "@/components/Spinner/Spinner";
import Pagination5 from "@/components/Pagination/Pagination5";
import { useEffect } from "react";
import { Message } from "@/types/interfaces/users.interface";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

interface DraftTableProps {
  path: string;
  person: string;
}

const DraftTable = ({ path, person }: DraftTableProps) => {
  const {
    isLoading,
    setIsLoading,
    draftMessages,
    totalDraftMessages,
    handleDeleteMessage,
    currentPage,
    setCurrentPage,
    setDraftMessages,
  } = useSocketContext();
  const { user } = useGlobalContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;

  //Fetch Draft Messages
  useEffect(() => {
    console.log("loading from draft table");
    const fetchSentMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Message[]>(
          `${url}/messages/draft/${user}/${currentPage}`
        );
        const result = response.data;
        setDraftMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentMessages();
  }, [
    currentPage,
    setDraftMessages,
    setIsLoading,
    url,
    user,
    draftMessages.length,
  ]);

  const totalDisplayedMessages = 5;
  const totalPageNumbers = Math.ceil(
    totalDraftMessages / totalDisplayedMessages
  );

  let startNumber = 1;
  let endNumber = currentPage * totalDisplayedMessages;

  if (endNumber > totalDraftMessages) {
    endNumber = totalDraftMessages;
  }

  if (currentPage > 1) {
    const page = currentPage - 1;
    startNumber = page * totalDisplayedMessages + 1;
  }

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
      console.error("Error deleting resource:", error);
    }
  };

  const convertDate = (isoDateString: Date) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const handleNavigate = (id: string) => {
    navigate(`/notifications/draft/${id}`);
  };

  return (
    <>
      <div className="ml-[11rem] border rounded-md shadow-sm p-4 mb-4">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold mb-6 ">{path}</h1>
          <TableRowCounter
            startNumber={startNumber}
            endNumber={endNumber}
            totalNumber={totalDraftMessages}
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
              {draftMessages.map((msg) => (
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
                    </TableCell>
                    <TableCell className="w-[115px] py-2">
                      {convertDate(msg.date)}
                    </TableCell>
                    <TableCell className="flex gap-2 py-auto">
                      <Edit
                        onClick={() => handleNavigate(msg.id)}
                        color="#044BD9"
                        className="cursor-pointer"
                      />
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
                              onClick={() => handleDelete(msg.id)}
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

export default DraftTable;
