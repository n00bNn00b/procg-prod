import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Token, Users, Message } from "@/types/interfaces/users.interface";
import socket from "@/Socket/Socket";

interface GlobalContextProviderProps {
  children: ReactNode;
}

interface GlobalContex {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  token: Token;
  setToken: React.Dispatch<React.SetStateAction<Token>>;
  users: Users[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socketMessage: Message[];
  setSocketMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const GlobalContex = createContext({} as GlobalContex);

export function useGlobalContext() {
  return useContext(GlobalContex);
}

export function GlobalContextProvider({
  children,
}: GlobalContextProviderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [token, setToken] = useState<Token>({});
  const [users, setUsers] = useState<Users[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socketMessage, setSocketMessages] = useState<Message[]>([]);

  const user = token?.user_name;
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    socket.emit("register", user);

    socket.on("message", (data) => {
      setSocketMessages((prevArray) => [data, ...prevArray]);
    });
  }, [user, socketMessage]);

  //Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<Users[]>(
          `${url}/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [url]);

  //Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${url}/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [messages, url]);

  return (
    <GlobalContex.Provider
      value={{
        open,
        setOpen,
        token,
        setToken,
        users,
        messages,
        setMessages,
        socketMessage,
        setSocketMessages,
      }}
    >
      {children}
    </GlobalContex.Provider>
  );
}
