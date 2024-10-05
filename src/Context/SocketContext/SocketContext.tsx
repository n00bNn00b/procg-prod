import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";

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
    
    const socket = io(`${url}`, {
        query: {
          key: user
        }
      });

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
    
      socket.on("offlineMessage", (data: Message) => {
        setSocketMessages((prevArray) => [data, ...prevArray]);
        const duplicate = messages.find(msg => msg.id === data.id);
        if(!duplicate) {
          setMessages((prev) => [data, ...prev]);
        }
      })
    
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
        setMessages(response.data);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchMessages();
  }, [url]);

    return (
        <SocketContext.Provider value={
            {handlesendMessage,
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