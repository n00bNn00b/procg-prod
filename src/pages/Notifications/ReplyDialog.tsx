import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import { Message } from "@/types/interfaces/users.interface";
import { MessageCircleReply, Reply } from "lucide-react"
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid"

interface ReplyDialogProps {
  parrentid: string;
  involvedUsers: string[];
  setTotalMessages: React.Dispatch<React.SetStateAction<Message[]>>
}
  
const ReplyDialog = ({parrentid, involvedUsers, setTotalMessages}: ReplyDialogProps) => {
  const {token} = useGlobalContext();
  const {handlesendMessage, setMessages} = useSocketContext();
  const { toast } = useToast();
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const sender = token.user_name;
  const recivers = involvedUsers.filter(user => user !== sender)
  
  const handleSend = () => {
    const id = uuidv4();
    const data = {
      id,
      sender, 
      recivers,
      subject,
      body,
      date: new Date(),
      status: "Sent",
      parentid: parrentid,
      involvedusers: involvedUsers
    };

    handlesendMessage(data);
    setBody("");
    setSubject("");
    toast({
      title: "Message sent"
    })
    setMessages((prev) => [data, ...prev])
    setTotalMessages((prev) => [data, ...prev]);
  }

  return (
    <Dialog>
        <DialogTrigger className="p-1 rounded-md hover:bg-winter-100/50">
            <MessageCircleReply size={20}/>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle className=" font-bold">Reply</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 w-full text-dark-400">
              <label className="font-semibold ">Subject</label>
              <input type="text" 
                    className="rounded-sm outline-none border pl-2 h-8 w-full text-sm"
                    value={subject}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 w-full text-dark-400">
              <label className="font-semibold ">Body</label>
              <textarea className="rounded-sm outline-none border pl-2 h-40 w-full scrollbar-thin text-sm"
                      value={body}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)} />
            </div>
            <DialogFooter>
              <button onClick={handleSend} className="flex gap-1 items-center px-5 py-2 rounded-r-full rounded-l-md bg-dark-100 text-white hover:scale-95 duration-300">
                  <Reply size={18}/>  
                  <p className="font-semibold ">Reply</p>
              </button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

  )
}

export default ReplyDialog
