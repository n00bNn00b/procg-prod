import { Send, Delete, ArrowLeft, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ChangeEvent, useEffect, useState } from "react";
import { Check} from "lucide-react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import ButtonSpinner from "@/components/Spinner/ButtonSpinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { tailspin } from "ldrs";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

tailspin.register();

interface Message {
  sender: string;
  recivers: string[];
  subject: string;
  body: string;
  date: string;
  status: string;
}
const SingleDraft = () => {
  const { users, token, messages, setMessages, handlesendMessage} = useGlobalContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;
  const idString= useParams();
  const id = idString.id;
  const [recivers, setRecivers] =useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isAllClicked, setIsAllClicked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const sender = token.user_name;

  const totalusers = [...recivers, sender];
  const uniqueUsers = [...new Set(totalusers)];
  
  useEffect(()=> {
    const fetchMessage = async () => {
        try {
            const response = await axios.get<Message>(`${url}/messages/${id}`);
            const result = response.data;
            setRecivers(result.recivers);
            setSubject(result.subject);
            setBody(result.body)
        } catch (error) {
            console.log(error)
        } finally {
          setIsLoading(false);
        }
    }

    fetchMessage();
}, [id, url]);
  

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
  const newID = uuidv4();
  const data = {
    id: newID,
    sender, 
    recivers,
    subject,
    body,
    date: new Date(),
    status: "Sent",
    parentid: newID,
    involvedusers: uniqueUsers
  };
  handlesendMessage(data);
  setIsSending(true);
  setMessages((prev) => [data, ...prev])
  toast({
    title: "Message Sent"
  })
  
  try {
    const response = await axios.delete(`${url}/messages/${id}`);
    console.log('Resource deleted:', response.data);
    const currentMessages = messages.filter(msg => msg.id !== id);
    setMessages(currentMessages);
  } catch (error) {
    console.error('Error deleting resource:', error);
  }

  
  setRecivers([]);
  setSubject('');
  setBody('');
  setIsSending(false);
  navigate('/notifications/draft');
};

const handleDelete = async () => {
  try {
    const response = await axios.delete(`${url}/messages/${id}`);
    console.log('Resource deleted:', response.data);
    const currentMessages = messages.filter(msg => msg.id !== id);
    setMessages(currentMessages);
  } catch (error) {
    console.error('Error deleting resource:', error);
  }
  navigate("/notifications/draft")
}

return (
    <div className="w-full flex justify-center">
        {
          isLoading? (
           <div className="flex h-[50vh] items-center">
             <l-tailspin size="80" stroke="5" speed="2" color="#68788C"></l-tailspin>
           </div>   
          ) : (
            <Card className="w-full mb-4">
            <CardHeader>
                <div className="flex text-dark-400">
                  <Link to="/notifications/draft" className="p-1 rounded-md hover:bg-winter-100/50">
                    <ArrowLeft size={20}/>
                  </Link>
                  <button onClick={handleDelete} className="p-1 rounded-md hover:bg-winter-100/50">
                    <Trash2 size={20}/>
                  </button>
                </div>
                <CardTitle className="font-montserrat font-bold">Draft Message</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 justify-between">
                      <DropdownMenu>
                      <DropdownMenuTrigger className="bg-dark-100 text-white w-44 h-8 rounded-sm font-semibold font-montserrat">Select Recipients</DropdownMenuTrigger>
                      <DropdownMenuContent className="w-44 max-h-[255px] overflow-auto scrollbar-thin">
                      <input type="text" 
                              className="w-full bg-light-100 border-b border-light-400 outline-none pl-2"
                              placeholder="Search..."
                              value={query}
                              onChange={handleQueryChange}/>
                        <div onClick={handleSelectAll} className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer">
                            <p>All</p>
                        </div>
                        {filterdUser.map(user => (
                          <div onClick={()=> handleReciever(user.user_name)} key={user.user_id} className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer">
                            <p>{user.user_name}</p>
                            {recivers.includes(user.user_name) ? <Check size={14} color="#038C5A"/>: null}
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-2 w-[calc(100%-11rem)] justify-end">
                      <div className="rounded-sm max-h-[4.5rem] scrollbar-thin overflow-auto flex flex-wrap gap-1">
                          {recivers.map(rec => (
                              <div key={rec} className="flex gap-1 bg-winter-100 h-8 px-3 items-center rounded-full">
                                  <p className="font-semibold font-montserrat">{rec}</p>
                                  <div onClick={()=> handleRemoveReciever(rec)} className="flex h-[65%] items-end cursor-pointer">
                                      <Delete size={18} />
                                  </div>
                              </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full text-dark-400">
                      <label className="font-semibold font-montserrat">Subject</label>
                      <input type="text" 
                          className="rounded-sm outline-none border pl-2 h-8 w-full text-sm"
                          value={subject}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2 w-full text-dark-400">
                      <label className="font-semibold font-montserrat">Body</label>
                      <textarea className="rounded-sm outline-none border pl-2 h-36 w-full scrollbar-thin text-sm"
                              value={body}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)} />
                  </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                {recivers.length === 0 || body === "" ? null : 
                <button onClick={handleSend} className="flex gap-1 items-center px-5 py-2 rounded-r-full rounded-l-md bg-dark-100 text-white hover:scale-95 duration-300">
                    {isSending? <ButtonSpinner/>: <Send size={18}/>}
                    <p className="font-semibold font-montserrat">Send</p>
                </button> }
            </CardFooter>
        </Card>
          )
        }
    </div>
  )
}

export default SingleDraft
