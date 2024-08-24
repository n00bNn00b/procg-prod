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
import { IDataSourceTypes } from "@/types/interfaces/datasource.interface";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
  fetchDataSources: () => Promise<IDataSourceTypes[] | undefined>;
  fetchDataSource: (id: number) => Promise<IDataSourceTypes>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createDataSource: (postData: IDataSourceTypes) => Promise<void>;
  updateDataSource: (id: number, postData: IDataSourceTypes) => Promise<void>;
  deleteDataSource: (id: number) => Promise<void>;
}

const GlobalContex = createContext({} as GlobalContex);

export function useGlobalContext() {
  return useContext(GlobalContex);
}

export function GlobalContextProvider({
  children,
}: GlobalContextProviderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [token, setToken] = useState<Token>(() => {
    const storeData = localStorage.getItem("token");
    if (storeData) {
      try {
        const userData = JSON.parse(storeData);
        return userData;
      } catch (error) {
        console.error("Error parsing stored access token:", error);
        return null;
      }
    }
    return null;
  });

  const [users, setUsers] = useState<Users[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socketMessage, setSocketMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const user = token?.user_name;
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    socket.emit("register", user);
  }, [user]);

  useEffect(() => {
    socket.on("message", (data) => {
      setSocketMessages((prevArray) => [data, ...prevArray]);
    });

    socket.on("offlineMessage", (data) => {
      setSocketMessages(data);
    });

    return () => {
      socket.off("message");
      socket.off("offlineMessage");
    };
  }, [socketMessage]);

  //Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<Users[]>(`${url}/users`);
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
        const response = await axios.get<Message[]>(`${url}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [url, messages]);

  //Fetch DataSources
  const fetchDataSources = async () => {
    try {
      const response = await axios.get<IDataSourceTypes[]>(
        `${url}/data-sources`
      );
      return response.data ?? [];
    } catch (error) {
      console.log(error);
    }
  };
  //Fetch SingleDataSource
  const fetchDataSource = async (id: number): Promise<IDataSourceTypes> => {
    try {
      const response = await axios.get<IDataSourceTypes>(
        `${url}/data-sources/${id}`
      );
      if (response.status === 200) {
        // Check if status code indicates success
        return response.data;
      } else {
        throw new Error(
          `Failed to fetch data source, status code: ${response.status}`
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  // Create Data Source
  const createDataSource = async (postData: IDataSourceTypes) => {
    const {
      data_source_id,
      datasource_name,
      description,
      application_type,
      application_type_version,
      last_access_synchronization_date,
      last_access_synchronization_status,
      last_transaction_synchronization_date,
      last_transaction_synchronization_status,
      default_datasource,
    } = postData;
    try {
      const res = await axios.post<IDataSourceTypes>(`${url}/data-sources`, {
        data_source_id,
        datasource_name,
        description,
        application_type,
        application_type_version,
        last_access_synchronization_date,
        last_access_synchronization_status,
        last_transaction_synchronization_date,
        last_transaction_synchronization_status,
        default_datasource,
      });
      // for sync data call fetch data source
      console.log(res);
      await fetchDataSources();
    } catch (error) {
      console.log(error);
    }
  };
  // Update Data Source
  const updateDataSource = async (id: number, postData: IDataSourceTypes) => {
    try {
      const res = await axios.put<IDataSourceTypes>(
        `${url}/data-sources/${id}`,
        {
          data_source_id: id,
          datasource_name: postData.datasource_name,
          description: postData.description,
          application_type: postData.application_type,
          application_type_version: postData.application_type_version,
          last_access_synchronization_date:
            postData.last_access_synchronization_date,
          last_access_synchronization_status:
            postData.last_access_synchronization_status,
          last_transaction_synchronization_date:
            postData.last_transaction_synchronization_date,
          last_transaction_synchronization_status:
            postData.last_transaction_synchronization_status,
          default_datasource: postData.default_datasource,
        }
      );
      // for sync data call fetch data source
      fetchDataSources();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  // Delete DataSource
  const deleteDataSource = async (id: number) => {
    try {
      const res = await axios.delete<IDataSourceTypes>(
        `${url}/data-sources/${id}`
      );

      if (res.status === 200) {
        toast({
          title: "Successfully Deleted",
          description: `DataSource Name : ${res.data.datasource_name}`,
        });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
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
        fetchDataSources,
        fetchDataSource,
        isLoading,
        setIsLoading,
        createDataSource,
        updateDataSource,
        deleteDataSource,
      }}
    >
      <Toaster />
      {children}
    </GlobalContex.Provider>
  );
}
