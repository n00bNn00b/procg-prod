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
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";
import { Check, Trash2, View, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useNavigate } from "react-router-dom";


  interface NotificationTableProps {
    path: string;
    person: string;
    recievedMessages: Message[];
    
  }

const NotificationTable = ({path, person, recievedMessages}: NotificationTableProps) => {
  const {socketMessage, setSocketMessages, messages, setMessages} = useGlobalContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  
  const uniquMessagesIds = socketMessage.map(msg => (msg.id));
    
  const handleUniqueMessages = (id: string) => {
      const newArray = socketMessage.filter(msg => msg.id !== id);
      setSocketMessages(newArray)
      navigate(`/notifications/inbox/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${url}/messages/${id}`);
      console.log('Resource deleted:', response.data);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
    toast({
      title: "Message has been deleted."
    })
    const currentMessages = messages.filter(msg => msg.id !== id);
    setMessages(currentMessages);
  }

  const convertDate = (isoDateString: Date) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  }

  return (
    <div className="ml-[11rem] border rounded-md shadow-sm p-4">
        <h1 className="text-lg font-bold mb-6">{path}</h1>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="font-bold">{person}</TableHead>
                <TableHead className="font-bold"><span>Subject/</span>Body</TableHead>
                <TableHead className="w-[115px] font-bold">Date</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recievedMessages.map(msg => (
                  <TableRow key={msg.id} className={uniquMessagesIds.includes(msg.id) ? "bg-winter-100/30" : "mt-0"}>
                    <TableCell>{msg.sender}</TableCell>
                    <TableCell>
                      <span className="font-medium mr-1">{msg.subject}</span> 
                      <span className="text-dark-400 mr-1">{msg.body?.slice(0,60)}</span>
                      <span>...</span>
                    </TableCell>
                    <TableCell className="w-[115px]">{convertDate(msg.date)}</TableCell>
                    <TableCell className="flex gap-2">
                      <View onClick={()=>handleUniqueMessages(msg.id)} color="#044BD9" className="cursor-pointer"/>
                      <AlertDialog>
                        <AlertDialogTrigger>
                        <Trash2 color="#E60B0B"/>
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

export default NotificationTable
