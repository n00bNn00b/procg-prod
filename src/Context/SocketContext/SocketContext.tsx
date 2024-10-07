import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";
import { io } from "socket.io-client";


interface SocketContextProps {
    children: ReactNode;
}

interface SocketContext {
  messages: Message[];
  handlesendMessage: (data: Message) => void;
  handleDisconnect: () => void;
  handleRead: (id: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socketMessage: Message[];
  setSocketMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  
}

const SocketContext = createContext({} as SocketContext);

export function useSocketContext() {
    return useContext(SocketContext)
}

export function SocketContextProvider({children}: SocketContextProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [socketMessage, setSocketMessages] = useState<Message[]>([]);
    const url = import.meta.env.VITE_API_URL;
    const {user} = useGlobalContext();

    const socket = io(url, {
        query: {
            key: user
        }
    })
    
    
      const handlesendMessage = (data: Message) => {
        socket.emit("sendMessage", data)
      }
    
      const handleDisconnect = () => {
        socket.disconnect();
      }
    
      const handleRead = (id: string) => {
        socket.emit("read", {id, user})
      }
    
     useEffect(() => {
      socket.on("message", (data) => {
        setSocketMessages((prevArray) => [data, ...prevArray]);
        setMessages((prev) => [data, ...prev]);
      });
    
      socket.on("sync", (id) => {
        const synedSocketMessages = socketMessage.filter(msg => msg.parentid !== id);
        setSocketMessages(synedSocketMessages);
      })
    
        return () => {
          socket.disconnect();
        };
      }, [socketMessage, messages, socket]);

      //Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(`${url}/messages`);
        const result = response.data;
        setMessages(result);
        const recievedMessages = result.filter(message => message.recivers.includes(user));
        console.log(recievedMessages)
        const notificationMessages = recievedMessages.filter(msg => msg.readers?.includes(user));
        console.log(notificationMessages);
        setSocketMessages(notificationMessages);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchMessages();
  }, [url, user]);

  console.log(socketMessage);

    return (
        <SocketContext.Provider value={
            {
            handlesendMessage,
            handleDisconnect,
            handleRead,
            messages,
            setMessages,
            socketMessage,
            setSocketMessages}}>
            {children}
        </SocketContext.Provider>
    )
}