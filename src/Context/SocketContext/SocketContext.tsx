import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGlobalContext, userExample } from "../GlobalContext/GlobalContext";
import {
  IUserLinkedDevices,
  Message,
} from "@/types/interfaces/users.interface";
import { io } from "socket.io-client";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useUserIP from "@/hooks/useUserIP";
import useUserLocation from "@/hooks/useUserLocation";

interface SocketContextProps {
  children: ReactNode;
}

interface SocketContext {
  receivedMessages: Message[];
  handlesendMessage: (data: Message) => void;
  handleDisconnect: () => void;
  handleRead: (id: string) => void;
  handleDeleteMessage: (id: string) => void;
  setReceivedMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socketMessage: Message[];
  setSocketMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sentMessages: Message[];
  setSentMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  draftMessages: Message[];
  setDraftMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  recycleBinMsg: Message[];
  setRecycleBinMsg: React.Dispatch<React.SetStateAction<Message[]>>;
  handleDraftMessage: (data: Message) => void;
  totalReceivedMessages: number;
  setTotalReceivedMessages: React.Dispatch<React.SetStateAction<number>>;
  totalSentMessages: number;
  setTotalSentMessages: React.Dispatch<React.SetStateAction<number>>;
  totalDraftMessages: number;
  setTotalDraftMessages: React.Dispatch<React.SetStateAction<number>>;
  totalRecycleBinMsg: number;
  handleDraftMsgId: (id: string) => void;
  addDevice: (data: IUserLinkedDevices) => void;
  inactiveDevice: (data: IUserLinkedDevices) => void;
  linkedDevices: IUserLinkedDevices[];
  setLinkedDevices: React.Dispatch<React.SetStateAction<IUserLinkedDevices[]>>;
}

const SocketContext = createContext({} as SocketContext);

// eslint-disable-next-line react-refresh/only-export-components
export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketContextProvider({ children }: SocketContextProps) {
  const api = useAxiosPrivate();
  const { user, token, setToken, presentDevice, setPresentDevice } =
    useGlobalContext();
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [totalReceivedMessages, setTotalReceivedMessages] = useState<number>(0);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [totalSentMessages, setTotalSentMessages] = useState<number>(0);
  const [draftMessages, setDraftMessages] = useState<Message[]>([]);
  const [totalDraftMessages, setTotalDraftMessages] = useState<number>(0);
  const [socketMessage, setSocketMessages] = useState<Message[]>([]);
  const [recycleBinMsg, setRecycleBinMsg] = useState<Message[]>([]);
  const [totalRecycleBinMsg, setTotalRecycleBinMsg] = useState<number>(0);
  const url_location = window.location.pathname;
  const socket_url = import.meta.env.VITE_SOCKET_URL;
  const [linkedDevices, setLinkedDevices] = useState<IUserLinkedDevices[]>([]);
  const getUserIP = useUserIP();
  const getLocation = useUserLocation();

  // Memoize the socket connection so that it's created only once
  const socket = useMemo(() => {
    return io(socket_url, {
      path: "/socket.io/",
      query: {
        key: user,
      },
      transports: ["websocket"],
    });
  }, [socket_url, user]);

  //Fetch Notification Messages
  useEffect(() => {
    const fetchCounterMessages = async () => {
      try {
        if (!user) return;
        const [
          notificationTotal,
          receivedTotal,
          sentTotal,
          draftTotal,
          recyclebinTotal,
          linkedDevices,
        ] = await Promise.all([
          api.get(`/messages/notification/${user}`),
          api.get(`/messages/total-received/${user}`),
          api.get(`/messages/total-sent/${user}`),
          api.get(`/messages/total-draft/${user}`),
          api.get(`/messages/total-recyclebin/${user}`),
          api.get(`/devices/${token?.user_id}`),
        ]);
        setSocketMessages(notificationTotal.data);
        setTotalReceivedMessages(receivedTotal.data.total);
        setTotalSentMessages(sentTotal.data.total);
        setTotalDraftMessages(draftTotal.data.total);
        setTotalRecycleBinMsg(recyclebinTotal.data.total);
        setLinkedDevices(linkedDevices.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCounterMessages();
  }, [user, url_location, api]);

  // device Action
  useEffect(() => {
    const userInfo = async (user_id: number) => {
      try {
        if (!token || token?.user_id === 0) return;
        const ipAddress = await getUserIP();
        const geolocation = await getLocation();

        const deviceData = {
          ...presentDevice,
          ip_address: ipAddress ? ipAddress : "Unknown",
          location: geolocation ? geolocation : "Unknown (Location off)",
        };

        const response = await api.post("/devices/add-device", {
          user_id,
          deviceInfo: deviceData,
        });
        setPresentDevice(response.data);
        addDevice(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    userInfo(token.user_id);
  }, [token?.user_id, api, url_location]);

  const deviceSync = async (data: IUserLinkedDevices) => {
    try {
      if (!token || (token?.user_id === 0 && !presentDevice.id)) return;
      if (data.id === presentDevice.id) {
        try {
          await api.get(`/logout`);
          handleDisconnect();
          setToken(userExample);
          window.location.href = "/login";
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    const checkUserDevice = async () => {
      try {
        if (!token || token?.user_id === 0 || presentDevice?.id === 0) return;

        if (presentDevice.id && linkedDevices.length > 0) {
          const response = linkedDevices.some((device: IUserLinkedDevices) => {
            if (device?.id === presentDevice?.id && device?.is_active === 1) {
              return true;
            }
            return false;
          });

          if (!response) {
            try {
              await api.get(`/logout`);
              handleDisconnect();
              setToken(userExample);
              window.location.href = "/login";
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (error) {
        console.log("Error checking user device");
      }
    };

    checkUserDevice();
  }, [api, url_location, token?.user_id, presentDevice?.id]);

  //Listen to socket events
  useEffect(() => {
    socket.on("receivedMessage", (data) => {
      const receivedMessagesId = receivedMessages.map((msg) => msg.id);
      if (receivedMessagesId.includes(data.id)) {
        return;
      } else {
        setSocketMessages((prevArray) => [data, ...prevArray]);
        setReceivedMessages((prev) => [data, ...prev]);
        setTotalReceivedMessages((prev) => prev + 1);
      }
    });
    socket.on("sentMessage", (data) => {
      const sentMessageId = sentMessages.map((msg) => msg.id);
      if (sentMessageId.includes(data.id)) {
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
        return setDraftMessages(() => [data, ...newDraftMessages]);
      } else {
        setDraftMessages((prev) => [data, ...prev]);
        setTotalDraftMessages((prev) => prev + 1);
      }
    });

    socket.on("draftMessageId", (id) => {
      // for sync socket draft messages
      const draftMessageId = draftMessages.map((msg) => msg.id);
      if (draftMessageId.includes(id)) {
        console.log("check draftMessageId time");
        setDraftMessages((prev) => prev.filter((item) => item.id !== id));
        setTotalDraftMessages((prev) => prev - 1);
      }
    });

    socket.on("sync", (id) => {
      const synedSocketMessages = socketMessage.filter(
        (msg) => msg.parentid !== id
      );
      setSocketMessages(synedSocketMessages);
    });
    socket.on("deletedMessage", (id) => {
      if (receivedMessages.some((msg) => msg.id === id)) {
        // add to recycleBinMsg
        setRecycleBinMsg((prev) => {
          const deletedMessages = receivedMessages.find((msg) => msg.id === id);
          if (!deletedMessages) return prev;
          return [deletedMessages, ...prev];
        });
        setTotalRecycleBinMsg((prev) => prev + 1);

        // if receive message includes the id then remove it
        setReceivedMessages((prev) => prev.filter((msg) => msg.id !== id));
        setTotalReceivedMessages((prev) => prev - 1);
        setSocketMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else if (sentMessages.some((msg) => msg.id === id)) {
        // add to recycleBinMsg
        setRecycleBinMsg((prev) => {
          const deletedMessages = sentMessages.find((msg) => msg.id === id);
          if (!deletedMessages) return prev;
          return [deletedMessages, ...prev];
        });
        setTotalRecycleBinMsg((prev) => prev + 1);

        // Check if the message is already deleted before updating
        setSentMessages((prev) => {
          const filteredMessages = prev.filter((msg) => msg.id !== id);
          // Only update total if the message was actually removed
          if (filteredMessages.length < prev.length) {
            setTotalSentMessages((prevTotal) => prevTotal - 1);
          }
          return filteredMessages;
        });
      } else if (draftMessages.some((msg) => msg.id === id)) {
        // add to recycleBinMsg
        setRecycleBinMsg((prev) => {
          const deletedMessages = draftMessages.find((msg) => msg.id === id);
          if (!deletedMessages) return prev;
          return [deletedMessages, ...prev];
        });
        setTotalRecycleBinMsg((prev) => prev + 1);

        // Check if the message is already deleted before updating
        setDraftMessages((prev) => {
          const filteredMessages = prev.filter((msg) => msg.id !== id);
          // Only update total if the message was actually removed
          if (filteredMessages.length < prev.length) {
            setTotalDraftMessages((prevTotal) => prevTotal - 1);
          }
          return filteredMessages;
        });
      } else if (recycleBinMsg.some((msg) => msg.id === id)) {
        // Check if the message is already deleted before updating
        setRecycleBinMsg((prev) => {
          const filteredMessages = prev.filter((msg) => msg.id !== id);
          // Only update total if the message was actually removed
          if (filteredMessages.length < prev.length) {
            setTotalRecycleBinMsg(totalRecycleBinMsg - 1);
          }
          return filteredMessages;
        });
      }
    });

    // device Action
    socket.on("addDevice", (data) => {
      setLinkedDevices((prev) => {
        if (
          prev.some(
            (item) => item.id === data.id && item.is_active === data.is_active
          )
        ) {
          return prev;
        } else {
          const removed = prev.filter((item) => item.id !== data.id);
          return [data, ...removed];
        }
      });
    });

    socket.on("inactiveDevice", (data) => {
      deviceSync(data);
      setLinkedDevices((prev) => {
        if (
          prev.some(
            (item) => item.id === data.id && item.is_active === data.is_active
          )
        ) {
          return prev;
        } else {
          const removed = prev.filter((item) => item.id !== data.id);
          return [data, ...removed];
        }
      });
    });

    // socket.on("deletedMessage", (id) => {
    //   if (receivedMessages.some((msg) => msg.id === id)) {
    //     // if receive message includes the id then remove it
    //     setReceivedMessages((prev) => prev.filter((msg) => msg.id !== id));
    //     setTotalReceivedMessages((prev) => prev - 1);
    //     setSocketMessages((prev) => prev.filter((msg) => msg.id !== id));
    //     setTotalRecycleBinMsg((prev) => prev + 1);
    //   } else if (sentMessages.some((msg) => msg.id === id)) {
    //     console.log("sentMessage");
    //     // if sent message includes the id then remove it
    //     setSentMessages((prev) => prev.filter((msg) => msg.id !== id));
    //     setTotalSentMessages((prev) => prev - 1);
    //     setTotalRecycleBinMsg((prev) => prev + 1);
    //   } else if (draftMessages.some((msg) => msg.id === id)) {
    //     // if draft message includes the id then remove it
    //     setDraftMessages((prev) => prev.filter((msg) => msg.id !== id));
    //     setTotalDraftMessages((prev) => prev - 1);
    //     setTotalRecycleBinMsg((prev) => prev + 1);
    //   } else if (recycleBinMsg.some((msg) => msg.id === id)) {
    //     // if receive message includes the id then remove it
    //     setRecycleBinMsg((prev) => prev.filter((msg) => msg.id !== id));
    //     setTotalRecycleBinMsg((prev) => prev - 1);
    //   }
    // });

    return () => {
      socket.off("receivedMessage");
      socket.off("sentMessage");
      socket.off("draftMessage");
      socket.off("draftMessageId");
      socket.off("sync");
      socket.off("deletedMessage");
      socket.off("addDevice");
      socket.off("inactiveDevice");
      // socket.disconnect();
    };
  }, [
    draftMessages,
    receivedMessages,
    recycleBinMsg,
    sentMessages,
    setLinkedDevices,
    socket,
    socketMessage,
    totalRecycleBinMsg,
  ]);

  // messages Action
  const handlesendMessage = (data: Message) => {
    socket.emit("sendMessage", data);
  };

  const handleDisconnect = () => {
    socket.disconnect();
  };

  const handleRead = (id: string) => {
    socket.emit("read", { id, user });
  };
  const handleDeleteMessage = (id: string) => {
    socket.emit("deleteMessage", { id, user });
  };

  const handleDraftMessage = (data: Message) => {
    socket.emit("sendDraft", data);
  };

  const handleDraftMsgId = (id: string) => {
    socket.emit("draftMsgId", { id, user });
  };

  // device Action
  const addDevice = (data: IUserLinkedDevices) => {
    socket.emit("addDevice", { ...data, user });
  };

  const inactiveDevice = (data: IUserLinkedDevices) => {
    socket.emit("inactiveDevice", { ...data, user });
  };

  return (
    <SocketContext.Provider
      value={{
        handlesendMessage,
        handleDisconnect,
        handleRead,
        handleDeleteMessage,
        socketMessage,
        setSocketMessages,
        receivedMessages,
        setReceivedMessages,
        sentMessages,
        setSentMessages,
        draftMessages,
        setDraftMessages,
        recycleBinMsg,
        setRecycleBinMsg,
        handleDraftMessage,
        totalReceivedMessages,
        setTotalReceivedMessages,
        totalSentMessages,
        setTotalSentMessages,
        totalDraftMessages,
        setTotalDraftMessages,
        totalRecycleBinMsg,
        handleDraftMsgId,
        addDevice,
        inactiveDevice,
        linkedDevices,
        setLinkedDevices,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
