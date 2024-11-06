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
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import { useEffect, useState } from "react";
import { Message } from "@/types/interfaces/users.interface";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import Pagination4 from "@/components/Pagination/Pagination4";
import TableRowCounter from "@/components/TableCounter/TableRowCounter";
import Spinner from "@/components/Spinner/Spinner";

interface DraftTableProps {
  path: string;
  person: string;
}

const DraftTable = ({ path, person }: DraftTableProps) => {
  const { user } = useGlobalContext();
  const {
    draftMessages,
    setDraftMessages,
    setTotalDraftMessages,
    totalDraftMessages,
  } = useSocketContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const url = import.meta.env.VITE_API_URL;
  const totalDisplayedMessages = 5;
  const totalPageNumbers = Math.ceil(
    totalDraftMessages / totalDisplayedMessages
  );
  const paginationArray = Array.from(
    { length: totalPageNumbers },
    (_, i) => i + 1
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

  //Fetch Sent Messages
  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        setIsloading(true);
        const response = await axios.get<Message[]>(
          `${url}/api/v2/messages/draft/${user}/${currentPage}`
        );
        const result = response.data;
        setDraftMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setIsloading(false);
      }
    };

    fetchSentMessages();
  }, [url, user, currentPage, setDraftMessages]);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${url}/api/v2/messages/${id}`);
      console.log("Resource deleted:", response.data);
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
    toast({
      title: "Message has been deleted.",
    });
    const currentMessages = draftMessages.filter((msg) => msg.id !== id);
    setDraftMessages(currentMessages);
    setTotalDraftMessages((prev) => prev - 1);
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
      {isLoading ? (
        <div className="flex w-[100vw] h-[50vh] justify-center items-center">
          <Spinner size="80" color="#000000" />
        </div>
      ) : (
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
              <TableRow>
                <TableHead className="font-bold">{person}</TableHead>
                <TableHead className="font-bold">
                  <span>Subject/</span>Body
                </TableHead>
                <TableHead className="w-[115px] font-bold">Date</TableHead>
                <TableHead className="font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="py-2">
                    {msg.recivers.slice(0, 4).join(", ")}
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="font-medium mr-1">{msg.subject}</span>
                    <span className="text-dark-400 mr-1">
                      {msg.body?.slice(0, 60)}
                    </span>
                    <span>...</span>
                  </TableCell>
                  <TableCell className="w-[115px] py-2">
                    {convertDate(msg.date)}
                  </TableCell>
                  <TableCell className="flex gap-2 h-full items-center py-2">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex w-full justify-end mt-4">
            <Pagination4
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              paginationArray={paginationArray}
              totalPageNumbers={totalDraftMessages}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DraftTable;
