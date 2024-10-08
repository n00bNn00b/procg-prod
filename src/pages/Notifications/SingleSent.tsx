import {
    Card,
    CardTitle,
  } from "@/components/ui/card";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { ArrowLeft, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { tailspin } from "ldrs";
import ReplyDialog from "./ReplyDialog";
import { Message } from "@/types/interfaces/users.interface";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

tailspin.register();

const SingleSent = () => {
    const {token} = useGlobalContext();
    const {messages, setMessages} = useSocketContext();
    const [isLoading, setIsLoading] = useState(true);
    const url = import.meta.env.VITE_API_URL;
    const user = token.user_name;
    const idString= useParams();
    const id = idString.id;
    
    const [totalMessages, setTotalMessages] = useState<Message[]>([]);
    const [parrentMessage, setParrentMessage] = useState<Message>({
      id: "",
      sender: "",
      recivers: [],
      subject: "",
      body: "",
      date: new Date(),
      status: "",
      parentid: "",
      involvedusers: []
    });
    //Fetch TotalReplyMessages
    useEffect(()=> {
      const fetchMessage = async () => {
          try {
              const response = await axios.get<Message[]>(`${url}/messages/reply/${id}`);
              const result = response.data;
              setTotalMessages(result);
          } catch (error) {
              console.log(error)
          } finally {
            setIsLoading(false)
          }
      }

      fetchMessage();
  }, [id, url]);

  //Fetch SingleMessage
  useEffect(()=> {
    const fetchMessage = async () => {
        try {
            const response = await axios.get<Message>(`${url}/messages/${id}`);
            const result = response.data;
            setParrentMessage(result);
        } catch (error) {
            console.log(error)
        } finally {
          setIsLoading(false)
        }
    }

    fetchMessage();
}, [id, url]);

const totalInvolvedUsers = parrentMessage.involvedusers;

    const handleDelete = async () => {
      try {
        const response = await axios.delete(`${url}/messages/${id}`);
        console.log('Resource deleted:', response.data);
        const currentMessages = messages.filter(msg => msg.id !== id);
        setMessages(currentMessages);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }

    const convertDate = (isoDateString: Date) => {
      const date = new Date(isoDateString);
      const formattedDate = date.toLocaleString();
      return formattedDate;
    }

    const renderMessage = (msg: string) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      // Split the message by URLs and wrap each URL with <a> tag
      const parts = msg.split(urlRegex);
    
      return parts.map((part, index) => {
        // If the part matches the URL pattern, return a link
        if (urlRegex.test(part)) {
          return (
            <a href={part} key={index} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          );
        }
    
        // Otherwise, return the text and convert newlines to <br />
        return part.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            <br />
          </React.Fragment>
        ));
      });
      };
  return (
    <div className='flex justify-center items-center w-full mb-4'>
      {
        isLoading? (
          <div className="flex h-[50vh] items-center">
            <l-tailspin size="80" stroke="5" speed="2" color="#68788C"></l-tailspin>
          </div>   
         ) : (
          <div className="flex flex-col gap-4 w-full">
            {
              totalMessages.map(message => (
                <Card key={message.id} className="p-6 w-full">
                  <div className="flex text-dark-400 mb-4">
                    <Link to={user === message.sender ? "/notifications/sent":"/notifications/inbox" } className="p-1 rounded-md hover:bg-winter-100/50">
                      <ArrowLeft size={20}/>
                    </Link>
                    <button onClick={handleDelete} className="p-1 rounded-md hover:bg-winter-100/50">
                      <Trash2 size={20}/>
                    </button>
                    <ReplyDialog parrentid={parrentMessage.id} involvedUsers={totalInvolvedUsers} setTotalMessages={setTotalMessages}/>
                  </div>
                  <CardTitle className="text-blue-600">{`${message.subject}`}</CardTitle>
                  <p className="my-4 text-dark-400">{convertDate(message.date)}</p>
                  <div className="flex justify-between">
                      <div className="flex flex-col text-dark-400">
                        <p className="text-blue-600  font-semibold">From</p>
                        <p>{message.sender}</p>
                          <img src="https://plus.unsplash.com/premium_photo-1682095643806-79da986ccf8d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                              alt="img" className="w-10 h-10 rounded-full object-cover object-center"/>
                      </div>
                      <div className="flex flex-col text-dark-400">
                        <p className="text-blue-600  font-semibold text-right">To</p>
                        <div className="flex gap-2 max-w-[400px]">
                        {message.recivers.map(rcvr => (
                          <div className="flex flex-col text-dark-400">
                          <p>{rcvr}</p>
                          <img src="https://plus.unsplash.com/premium_photo-1682095643806-79da986ccf8d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                              alt="img" className="w-10 h-10 rounded-full object-cover object-center"/>
                          </div>
                        )) }
                        </div>
                      </div>
                  </div>
                  <p className="whitespace-pre-wrap mt-4">{renderMessage(message.body)}</p>
                </Card>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default SingleSent
