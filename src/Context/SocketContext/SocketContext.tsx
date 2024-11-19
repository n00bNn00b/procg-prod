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
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  receivedMessages: Message[];
  handlesendMessage: (data: Message) => void;
  handleDisconnect: () => void;
  handleRead: (id: string) => void;
  handleCountSyncSocketMsg: (id: string) => void;
  setReceivedMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socketMessage: Message[];
  setSocketMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sentMessages: Message[];
  setSentMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  draftMessages: Message[];
  setDraftMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleDraftMessage: (data: Message) => void;
  saveDraftMessage: string[];
  totalReceivedMessages: number;
  setTotalReceivedMessages: React.Dispatch<React.SetStateAction<number>>;
  totalSentMessages: number;
  setTotalSentMessages: React.Dispatch<React.SetStateAction<number>>;
  totalDraftMessages: number;
  setTotalDraftMessages: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const SocketContext = createContext({} as SocketContext);

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketContextProvider({ children }: SocketContextProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [totalReceivedMessages, setTotalReceivedMessages] = useState(0);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [totalSentMessages, setTotalSentMessages] = useState(0);
  const [draftMessages, setDraftMessages] = useState<Message[]>([]);
  const [saveDraftMessage, setSaveDraftMessage] = useState<string[]>([]);
  const [totalDraftMessages, setTotalDraftMessages] = useState(0);
  const [socketMessage, setSocketMessages] = useState<Message[]>([]);
  const url = import.meta.env.VITE_API_URL;
  const socket_url = import.meta.env.VITE_SOCKET_URL;
  const { user } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState<number>(1);

  //Socket
  const socket = io(socket_url, {
    path: "/socket.io/",
    query: {
      key: user,
    },
    transports: ["websocket"],
  });

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

  //Fetch Received Messages
  useEffect(() => {
    const fetchReceivedMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Message[]>(
          `${url}/messages/received/${user}/${currentPage}`
        );
        const result = response.data;
        setReceivedMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceivedMessages();
  }, [url, user, currentPage, receivedMessages.length, totalReceivedMessages]);

  // Fetch Total Received Messages Number
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

  //Fetch Sent Messages
  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Message[]>(
          `${url}/messages/sent/${user}/${currentPage}`
        );
        const result = response.data;
        setSentMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentMessages();
  }, [url, user, currentPage, totalSentMessages, sentMessages.length]);

  // Fetch Total Sent Messages Number
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

  //Fetch Draft Messages
  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Message[]>(
          `${url}/messages/draft/${user}/${currentPage}`
        );
        const result = response.data;
        setDraftMessages(result);
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentMessages();
  }, [
    url,
    user,
    currentPage,
    draftMessages.length,
    totalDraftMessages,
    saveDraftMessage.length,
  ]);

  // Fetch Total Draft Messages Number
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
    socket.on("receivedMessage", (data) => {
      setSocketMessages((prevArray) => [data, ...prevArray]);
      const receivedMessagesId = receivedMessages.map((msg) => msg.id);
      if (receivedMessagesId.includes(data.id)) {
        return;
      } else {
        setReceivedMessages((prev) => [data, ...prev]);
        setTotalReceivedMessages((prev) => prev + 1);
      }
    });

    socket.on("sentMessage", (data) => {
      const sentMessagesId = sentMessages.map((msg) => msg.id);
      if (sentMessagesId.includes(data.id)) {
        return;
      } else {
        setSentMessages((prev) => [data, ...prev]);
        setTotalSentMessages((prev) => prev + 1);
      }
    });

    socket.on("draftMessage", (data) => {
      const draftMessagesId = draftMessages.map((msg) => msg.id);
      if (draftMessagesId.includes(data.id)) {
        // remove message match id
        const newDraftMessages = draftMessages.filter(
          (msg) => msg.id !== data.id
        );
        // For state call
        setSaveDraftMessage((prev) => [...prev, data.id]);
        return setDraftMessages(() => [data, ...newDraftMessages]);
      } else {
        setDraftMessages((prev) => [data, ...prev]);
        setTotalDraftMessages((prev) => prev + 1);
      }
    });

    socket.on("sync", (id) => {
      const synedSocketMessages = socketMessage.filter(
        (msg) => msg.parentid !== id
      );
      setSocketMessages(synedSocketMessages);
    });

    socket.on("removeMsgFromSocketMessages", (id) => {
      if (receivedMessages.some((msg) => msg.id === id)) {
        // if receive message includes the id then remove it
        setReceivedMessages((prev) => prev.filter((msg) => msg.id !== id));
        setTotalReceivedMessages((prev) => prev - 1);
        setSocketMessages(socketMessage.filter((msg) => msg.id !== id));
      } else if (sentMessages.some((msg) => msg.id === id)) {
        // if sent message includes the id then remove it
        setSentMessages((prev) => prev.filter((msg) => msg.id !== id));
        setTotalSentMessages((prev) => prev - 1);
      } else if (draftMessages.some((msg) => msg.id === id)) {
        // if draft message includes the id then remove it
        setDraftMessages((prev) => prev.filter((msg) => msg.id !== id));
        setTotalDraftMessages((prev) => prev - 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketMessage, receivedMessages, draftMessages, sentMessages, socket]);

  const handlesendMessage = (data: Message) => {
    socket.emit("sendMessage", data);
  };

  const handleDisconnect = () => {
    socket.disconnect();
  };

  const handleRead = (id: string) => {
    socket.emit("read", { id, user });
  };
  const handleCountSyncSocketMsg = (id: string) => {
    socket.emit("countSyncSocketMsg", { id, user });
  };

  const handleDraftMessage = (data: Message) => {
    socket.emit("sendDraft", data);
  };

  return (
    <SocketContext.Provider
      value={{
        isLoading,
        setIsLoading,
        handlesendMessage,
        handleDisconnect,
        handleRead,
        handleCountSyncSocketMsg,
        socketMessage,
        setSocketMessages,
        receivedMessages,
        setReceivedMessages,
        sentMessages,
        setSentMessages,
        draftMessages,
        setDraftMessages,
        handleDraftMessage,
        saveDraftMessage,
        totalReceivedMessages,
        setTotalReceivedMessages,
        totalSentMessages,
        setTotalSentMessages,
        totalDraftMessages,
        setTotalDraftMessages,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
