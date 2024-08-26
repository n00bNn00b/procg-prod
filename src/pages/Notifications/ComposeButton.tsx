import { MailPlus, Paperclip, Send, Delete } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { ChangeEvent, useState } from "react";
import { Check} from "lucide-react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import socket from "@/Socket/Socket";
import ButtonSpinner from "@/components/Spinner/ButtonSpinner";
import { v4 as uuidv4 } from "uuid"



const ComposeButton = () => {
  const { users, token} = useGlobalContext();
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;
  
  const [recivers, setRecivers] =useState<string[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [showUsers, setShowUsers] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isAllClicked, setIsAllClicked] = useState(true);
  const sender = token.user_name;
  const time = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString();
  const date = `${time}, ${currentDate}`;
  const id = uuidv4();
  

const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value);
}

const filterdUser = users.filter((user) => user.user_name.toLowerCase().includes(query.toLowerCase()));

const handleReciever = (reciever: string) => {
  if(isAllClicked){
      const newArray = recivers.filter(rcvr => rcvr !== reciever)
      setRecivers(newArray)
  } 
  if(recivers.includes(reciever)) {
      return
  } else {
      setRecivers((prevArray) => [...prevArray, reciever])
  }
};

const handleRemoveReciever = (reciever: string) => {
  const newRecipients = recivers.filter(rcvr => rcvr !== reciever);
  setRecivers(newRecipients)
}

const handleSelectAll = ()=>{
  setIsAllClicked(true);
  const allusers = users.map(user => (user.user_name));
  setRecivers(allusers)
}

const handleSend = async () => {
  const data = {
    id,
    sender, 
    recivers,
    subject,
    body,
    date,
    status: "Sent"
  };
  
  socket.emit("sendMessage", data);
  toast({
    title: "Message sent"
  })
  setIsSending(true);

  setRecivers([]);
  setSubject('');
  setBody('');
  setIsSending(false);
  setShowUsers(false);
};

const handleDraft = async () => {
  const data = {
    id,
    sender, 
    recivers,
    subject,
    body,
    date,
    status: "Draft"
  };
  setIsDrafting(true);
  try {
    const response = await axios.post(`${url}/messages`, data);
    console.log('Response:', response.data);
    toast({
      title: "Message saved to draft"
    })
  } catch (error) {
    console.error('Error:', error);
   
  }

  setRecivers([]);
  setSubject('');
  setBody('');
  setIsDrafting(false);
  setShowUsers(false);
}


return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex gap-2 items-center px-5 py-2 rounded-xl bg-dark-100 text-white hover:scale-95 duration-300 fixed bottom-4">
            <MailPlus size={18}/>
            <p className="font-semibold">Compose</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button onClick={()=> setShowUsers(!showUsers)} className="bg-dark-100 text-white w-40 h-8 rounded-sm font-semibold">Select Recipients</button>
          <div className="rounded-sm w-[calc(100%-11rem)] max-h-[4.5rem] scrollbar-thin overflow-auto flex flex-wrap gap-1 justify-end">
              {recivers.map(rec => (
                  <div className="flex gap-1 bg-winter-100 h-8 px-3 items-center rounded-full">
                      <p className="font-semibold">{rec}</p>
                      <div onClick={()=> handleRemoveReciever(rec)} className="flex h-[65%] items-end cursor-pointer">
                          <Delete size={18} />
                      </div>
                  </div>
              ))}
          </div>
        </div>
        {showUsers? <div className="w-40 fixed z-10 bg-light-100 border rounded-b-sm top-[90px] max-h-[230px] overflow-auto scrollbar-thin">
            <input type="text" 
                   className="w-full bg-light-100 border-b border-light-400 outline-none pl-2"
                   placeholder="Search..."
                   value={query}
                   onChange={handleQueryChange}/>
            <div onClick={handleSelectAll} className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer">
                <p>All</p>
            </div>
            {filterdUser.map(user => (
                <div onClick={() => handleReciever(user.user_name)} key={user.user_id} className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer">
                    <p>{user.user_name}</p>
                    {recivers.includes(user.user_name) ? <Check size={14} color="#038C5A"/>: null}
                </div>
            ))}
         </div>: null}
        <div className="flex flex-col gap-2 w-full text-dark-400">
            <label className="font-semibold">Subject</label>
            <input type="text" 
                   className="rounded-sm outline-none border pl-2 h-8 w-full text-sm"
                   value={subject}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 w-full text-dark-400">
            <label className="font-semibold">Body</label>
            <textarea className="rounded-sm outline-none border pl-2 h-24 w-full scrollbar-thin text-sm"
                    value={body}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)} />
        </div>
        </div>
        <DialogFooter className="flex">
            {recivers.length === 0 || body === "" ? null : 
            <button onClick={handleDraft} className="flex gap-1 items-center px-5 py-2 rounded-l-full rounded-r-md bg-dark-300 text-white hover:scale-95 duration-300">
                {isDrafting? <ButtonSpinner/>: <Paperclip size={18}/>}
                <p className="font-semibold">Draft</p>
            </button>}
            {recivers.length === 0 || body === "" ? null : 
            <button onClick={handleSend} className="flex gap-1 items-center px-5 py-2 rounded-r-full rounded-l-md bg-dark-100 text-white hover:scale-95 duration-300">
                {isSending? <ButtonSpinner/>: <Send size={18}/>}
                <p className="font-semibold">Send</p>
            </button> }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ComposeButton
