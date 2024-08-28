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
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";
import { Check, Trash2, View, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

interface SentTableProps {
    path: string;
    person: string;
    sentMessages: Message[];
    
  }

const SentTable = ({path, person, sentMessages}: SentTableProps) => {
  const {messages, setMessages} = useGlobalContext()
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${url}/messages/${id}`);
      console.log('Resource deleted:', response.data);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
    toast({
      title: "Message has been deleted."
    });

    const currentMessages = messages.filter(msg => msg.id !== id);
    setMessages(currentMessages);
  }

  const convertDate = (isoDateString: Date) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  }

  return (
    <div className="ml-[11rem] rounded-md shadow-md p-4">
        <h1 className="text-lg font-semibold mb-6">{path}</h1>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{person}</TableHead>
                <TableHead><span className="font-bold">Subject/</span>Body</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sentMessages.map(msg => (
                  <TableRow key={msg.id}>
                    <TableCell>{msg.recivers.join(', ')}</TableCell>
                    <TableCell>
                      <span className="font-medium mr-1">{msg.subject}</span> 
                      <span className="text-dark-400 mr-1">{msg.body?.slice(0,60)}</span>
                      <span>...</span>
                    </TableCell>
                    <TableCell className="w-[110px]">{convertDate(msg.date)}</TableCell>
                    <TableCell className="flex gap-2 h-full items-center">
                      <Link to={`/notifications/sent/${msg.id}`} className="bg-blue-600 text-white p-[6px] rounded-full flex justify-center items-center">
                        <View size={20}/>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger>
                        <button className="bg-Red-200 text-white p-[6px] rounded-full flex justify-center items-center">
                          <Trash2 size={20}/>
                        </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete from both side.
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-Red-200 text-white flex justify-center items-center">
                              <X/>
                            </AlertDialogCancel>
                            <AlertDialogAction className="bg-green-600 text-white flex justify-center items-center" onClick={() => handleDelete(msg.id)}>
                              <Check/>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default SentTable
