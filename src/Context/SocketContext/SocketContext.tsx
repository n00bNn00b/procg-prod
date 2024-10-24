import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";
import { io } from "socket.io-client";

interface SocketContextProps {
  children: ReactNode;
}

interface SocketContext {
  receivedMessages: Message[];
  handlesendMessage: (data: Message) => void;
  handleDisconnect: () => void;
  handleRead: (id: string) => void;
  setReceivedMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socketMessage: Message[];
  setSocketMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sentMessages: Message[];
  setSentMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  draftMessages: Message[];
  setDraftMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleDraftMessage: (data: Message) => void;
  totalReceivedMessages: number;
  setTotalReceivedMessages: React.Dispatch<React.SetStateAction<number>>;
  totalSentMessages: number;
  setTotalSentMessages: React.Dispatch<React.SetStateAction<number>>;
  totalDraftMessages: number;
  setTotalDraftMessages: React.Dispatch<React.SetStateAction<number>>;
}

const SocketContext = createContext({} as SocketContext);

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketContextProvider({ children }: SocketContextProps) {
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [totalReceivedMessages, setTotalReceivedMessages] = useState(0);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [totalSentMessages, setTotalSentMessages] = useState(0);
  const [draftMessages, setDraftMessages] = useState<Message[]>([]);
  const [totalDraftMessages, setTotalDraftMessages] = useState(0);
  const [socketMessage, setSocketMessages] = useState<Message[]>([]);
  const url = import.meta.env.VITE_API_URL;
  const { user } = useGlobalContext();

  const socket = io(url, {
    query: {
      key: user,
    },
  });

  //Fetch Sent Messages
  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${url}/messages/sent/${user}`
        );
        const result = response.data;
        setSentMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchSentMessages();
  }, [url, user]);

  //Fetch Received Messages
  useEffect(() => {
    const fetchReceivedMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${url}/messages/received/${user}/1`
        );
        const result = response.data;
        setReceivedMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchReceivedMessages();
  }, [url, user]);

  //Fetch Draft Messages
  useEffect(() => {
    const fetchDraftMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${url}/messages/draft/${user}`
        );
        const result = response.data;
        setDraftMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchDraftMessages();
  }, [url, user]);

  //Fetch Notification Messages
  useEffect(() => {
    const fetchNotificationMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${url}/messages/notification/${user}`
        );
        const result = response.data;
        setSocketMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchNotificationMessages();
  }, [url, user]);

  //Fetch Total Received Messages Number
  useEffect(() => {
    const fetchTotalReceivedMessages = async () => {
      try {
        const response = await axios.get(
          `${url}/messages/total-received/${user}`
        );
        setTotalReceivedMessages(response.data.total);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchTotalReceivedMessages();
  }, [url, user]);

  //Fetch Total Sent Messages Number
  useEffect(() => {
    const fetchTotalSentMessages = async () => {
      try {
        const response = await axios.get(`${url}/messages/total-sent/${user}`);
        setTotalSentMessages(response.data.total);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchTotalSentMessages();
  }, [url, user]);

  //Fetch Total Draft Messages Number
  useEffect(() => {
    const fetchTotalDraftMessages = async () => {
      try {
        const response = await axios.get(`${url}/messages/total-draft/${user}`);
        setTotalDraftMessages(response.data.total);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchTotalDraftMessages();
  }, [url, user]);

  //Listen to socket events
  useEffect(() => {
    socket.on("message", (data) => {
      setSocketMessages((prevArray) => [data, ...prevArray]);
      setReceivedMessages((prev) => [data, ...prev]);
      setTotalReceivedMessages((prev) => prev + 1);
    });

    socket.on("sentMessage", (data) => {
      setSentMessages((prev) => [data, ...prev]);
      setTotalSentMessages((prev) => prev + 1);
    });

    socket.on("draftMessage", (data) => {
      setDraftMessages((prev) => [data, ...prev]);
      setTotalDraftMessages((prev) => prev + 1);
    });

    socket.on("sync", (id) => {
      const synedSocketMessages = socketMessage.filter(
        (msg) => msg.parentid !== id
      );
      setSocketMessages(synedSocketMessages);
    });

    return () => {
      socket.disconnect();
    };
  }, [socketMessage, receivedMessages, socket]);

  const handlesendMessage = (data: Message) => {
    socket.emit("sendMessage", data);
  };

  const handleDisconnect = () => {
    socket.disconnect();
  };

  const handleRead = (id: string) => {
    socket.emit("read", { id, user });
  };

  const handleDraftMessage = (data: Message) => {
    socket.emit("sendDraft", data);
  };

  return (
    <SocketContext.Provider
      value={{
        handlesendMessage,
        handleDisconnect,
        handleRead,
        socketMessage,
        setSocketMessages,
        receivedMessages,
        setReceivedMessages,
        sentMessages,
        setSentMessages,
        draftMessages,
        setDraftMessages,
        handleDraftMessage,
        totalReceivedMessages,
        setTotalReceivedMessages,
        totalSentMessages,
        setTotalSentMessages,
        totalDraftMessages,
        setTotalDraftMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
