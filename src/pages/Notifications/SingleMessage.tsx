import Spineer from "@/components/Spinner/Spineer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Message {
  sender: string;
  recivers: string[];
  subject: string;
  body: string;
  date: string;
  status: string;
}

const SingleMessage = () => {
    const {token, messages, setMessages} = useGlobalContext();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL;
    const user = token.user_name;
    const {id} = useParams();

   const [message, setMessage] = useState<Message>(
      {sender: "",
      recivers: [],
      subject: "",
      body: "",
      date: "",
      status: ""});
    //Fetch Messages
    useEffect(()=> {
        const fetchMessage = async () => {
            try {
                const response = await axios.get<Message>(`${url}/messages/${id}`);
                const result = response.data;
                console.log(result)
                setMessage(result);
                
            } catch (error) {
                console.log(error)
            } finally {
              setIsLoading(false)
            }
        }

        fetchMessage();
    }, [id, url]);

    const handleDelete = async () => {
      try {
        const response = await axios.delete(`${url}/messages/${id}`);
        console.log('Resource deleted:', response.data);
        const currentMessages = messages.filter(msg => msg.id !== id);
        setMessages(currentMessages);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
      if(user === message.sender) {
        navigate("/notifications/sent")
      } else {
        navigate("/notifications/inbox")
      }
    }

    const convertDate = (isoDateString: string) => {
      const date = new Date(isoDateString);
      const formattedDate = date.toLocaleString();
      return formattedDate;
    }

    const renderMessage = (msg: string) => {
        const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
        if (urlPattern.test(msg)) {
          return <a href={msg} target="_blank" rel="noopener noreferrer">{msg}</a>;
        }
        return `${msg}`;
      };
  return (
    <div className='flex justify-center items-center w-full mb-4'>
      {
        isLoading? <Spineer/> : (
          <Card>
            <CardHeader>
                <div className="flex text-dark-400">
                  <Link to={user === message.sender ? "/notifications/sent":"/notifications/inbox" } className="p-1 rounded-md hover:bg-winter-100/50">
                    <ArrowLeft size={20}/>
                  </Link>
                  <button onClick={handleDelete} className="p-1 rounded-md hover:bg-winter-100/50">
                    <Trash2 size={20}/>
                  </button>
                </div>
                <CardTitle>{`${message.subject}`}</CardTitle>
                <CardDescription className="flex flex-col justify-center gap-4">
                    <p>{convertDate(message.date)}</p>
                    <div className="flex flex-col">
                      <p>{message.sender}</p>
                        <img src="https://plus.unsplash.com/premium_photo-1682095643806-79da986ccf8d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                            alt="img" className="w-10 h-10 rounded-full object-cover object-center"/>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">{renderMessage(message.body)}</p>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}

export default SingleMessage
