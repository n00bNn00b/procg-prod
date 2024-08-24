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
import { Link } from "react-router-dom";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";


  interface NotificationTableProps {
    path: string;
    person: string;
    recievedMessages: Message[];
  }

const NotificationTable = ({path, person, recievedMessages}: NotificationTableProps) => {
  const {socketMessage, setSocketMessages} = useGlobalContext();
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;
  
  const uniquMessagesIds = socketMessage.map(msg => (msg.id));
  console.log(uniquMessagesIds);
    
  const handleUniqueMessages = (id: string) => {
      const newArray = socketMessage.filter(msg => msg.id !== id);
      setSocketMessages(newArray)
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
  }
  return (
    <div className="ml-[11rem] rounded-md shadow-md p-4">
        <h1 className="text-lg font-semibold mb-6">{path}</h1>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{person}</TableHead>
                <TableHead><span className="font-bold">Subject/</span>Body</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
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
                    <TableCell>{msg.date}</TableCell>
                    <TableCell className="flex gap-2 h-full items-center">
                      <Link onClick={()=>handleUniqueMessages(msg.id)} to={`/notifications/inbox/${msg.id}`} className="bg-blue-600 text-white p-[6px] rounded-full flex justify-center items-center">
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

export default NotificationTable
