import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  Token,
  Users,
  IAddUserTypes,
  ITenantsTypes,
  IPersonsTypes,
  IUsersInfoTypes,
  IUpdateUserTypes,
  IUserPasswordResetTypes,
} from "@/types/interfaces/users.interface";
import {
  IDataSourcePostTypes,
  IDataSourceTypes,
  IManageAccessEntitlementsPerPageTypes,
} from "@/types/interfaces/datasource.interface";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ManageAccessEntitlementsProvider } from "../ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { AACContextProvider } from "../ManageAccessEntitlements/AdvanceAccessControlsContext";
import { SocketContextProvider } from "../SocketContext/SocketContext";

interface GlobalContextProviderProps {
  children: ReactNode;
}

interface GlobalContex {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  token: Token;
  user: string;
  setToken: React.Dispatch<React.SetStateAction<Token>>;
  users: Users[];
  fetchDataSources: (
    page: number,
    limit: number
  ) => Promise<IManageAccessEntitlementsPerPageTypes | undefined>;
  fetchDataSource: (id: number) => Promise<IDataSourceTypes>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createDataSource: (postData: IDataSourcePostTypes) => Promise<void>;
  updateDataSource: (
    id: number,
    postData: IDataSourcePostTypes
  ) => Promise<void>;
  deleteDataSource: (id: number) => Promise<void>;
  createUser: (postData: IAddUserTypes) => void;
  fetchTenants: () => Promise<ITenantsTypes[] | undefined>;
  person: IPersonsTypes | undefined;
  usersInfo: IUsersInfoTypes[];
  fetchCombinedUser: () => Promise<void>;
  //lazy loading
  page: number;
  setPage: Dispatch<React.SetStateAction<number>>;
  totalPage: number;
  currentPage: number;
  limit: number;
  setLimit: Dispatch<React.SetStateAction<number>>;
  deleteCombinedUser: (user_ids: IUsersInfoTypes[]) => Promise<void>;
  updateUser: (id: number, userInfo: IUpdateUserTypes) => void;
  isOpenModal: string;
  setIsOpenModal: Dispatch<SetStateAction<string>>;
  resetPassword: (resetData: IUserPasswordResetTypes) => Promise<void>;
  getUserInfo: (user_id: number) => Promise<IUsersInfoTypes | undefined>;
}

const GlobalContex = createContext({} as GlobalContex);

export function useGlobalContext() {
  return useContext(GlobalContex);
}

export function GlobalContextProvider({
  children,
}: GlobalContextProviderProps) {
  // const { setIsOpenModal } = useManageAccessEntitlementsContext();
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
  const [person, setPerson] = useState<IPersonsTypes>();
  const [usersInfo, setUsersInfo] = useState<IUsersInfoTypes[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const url = import.meta.env.VITE_API_URL;
  const user = token?.user_name;

  //Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await axios.get<Users[]>(`${url}/api/v2/users`);
        if (token?.user_id) {
          const res = async () => {
            const person = await axios.get<IPersonsTypes>(
              `${url}/api/v2/persons/${token?.user_id}`
            );
            setPerson(person?.data);
          };
          res();
        }
        setUsers(users.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [url, token?.user_id]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(Number());
  const [currentPage, setCurrentPage] = useState<number>(1);
  // access entitlement elements lazy loading
  const fetchCombinedUser = async () => {
    try {
      setIsLoading(true);
      const users = await axios.get<Users[]>(`${url}/api/v2/users`);
      const res = await axios.get<IUsersInfoTypes[]>(
        `${url}/api/v2/combined-user/${page}/${limit}`
      );
      const totalCount = users.data.length;
      const totalPages = Math.ceil(totalCount / limit);

      setUsersInfo(res.data);
      setTotalPage(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  //user info
  const getUserInfo = async (user_id: number) => {
    try {
      setIsLoading(true);
      const res = await axios.get<IUsersInfoTypes>(
        `${url}/api/v2/combined-user/${user_id}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateUser = async (id: number, userInfo: IUpdateUserTypes) => {
    try {
      const res = await axios.put(
        `${url}/api/v2/combined-user/${id}`,
        userInfo
      );
      if (res.status === 200) {
        setIsOpenModal("");
        fetchCombinedUser();
        toast({
          title: "Info !!!",
          description: `Update successfully.`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // reset password
  const resetPassword = async (resetData: IUserPasswordResetTypes) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${url}/api/v2/user-credentials/reset-password`,
        resetData
      );

      if (res.status === 200) {
        toast({
          title: "Info !!!",
          description: `Reset password successfully.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Info !!!",
        variant: "destructive",
        description: `${error.response.data.message}`,
      });
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const deleteCombinedUser = async (user_ids: IUsersInfoTypes[]) => {
    console.log(user_ids, "user_ids");
    setIsLoading(true);
    try {
      for (const id of user_ids) {
        const [users, persons, credentials] = await Promise.all([
          axios.delete(`${url}/api/v2/users/${id.user_id}`),
          axios.delete(`${url}/api/v2/persons/${id.user_id}`),
          axios.delete(`${url}/api/v2/user-credentials/${id.user_id}`),
        ]);
        console.log(users, persons, credentials, "delete checked");
        if (
          users.status === 200 ||
          persons.status === 200 ||
          credentials.status === 200
        ) {
          toast({
            title: "Info !!!",
            description: `Delete successfully.`,
          });
        }
      }
    } catch (error: any) {
      console.log(error);
      fetchCombinedUser();
      toast({
        title: "Info !!!",
        description: `Error: ${error.message}`,
      });
    } finally {
      fetchCombinedUser();
      setIsLoading(false);
    }
  };
  //Fetch DataSources
  const fetchDataSources = async (page: number, limit: number) => {
    try {
      const response = await axios.get<IManageAccessEntitlementsPerPageTypes>(
        `${url}/api/v2/data-sources/${page}/${limit}`
      );
      const sortingData = response.data;
      return sortingData ?? [];
    } catch (error) {
      console.log(error);
    }
  };
  //Fetch SingleDataSource
  const fetchDataSource = async (id: number): Promise<IDataSourceTypes> => {
    try {
      const response = await axios.get<IDataSourceTypes>(
        `${url}/api/v2/data-sources/${id}`
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
  const createDataSource = async (postData: IDataSourcePostTypes) => {
    const {
      datasource_name,
      description,
      application_type,
      application_type_version,
      last_access_synchronization_status,
      last_transaction_synchronization_status,
      default_datasource,
      created_by,
      last_updated_by,
    } = postData;
    try {
      const res = await axios.post<IDataSourceTypes>(
        `${url}/api/v2/data-sources`,
        {
          datasource_name,
          description,
          application_type,
          application_type_version,
          last_access_synchronization_status,
          last_transaction_synchronization_status,
          default_datasource,
          created_by,
          last_updated_by,
        }
      );
      // for sync data call fetch data source
      console.log(res.status);
      if (res.status === 201) {
        toast({
          title: "Info !!!",
          description: `Data added successfully.`,
        });
      }
    } catch (error: any) {
      if (error.response.status === 408) {
        toast({
          title: "Info !!!",
          description: `Can't add data already exist !.`,
        });
      }
      console.log(error);
    }
  };
  // Update Data Source
  const updateDataSource = async (
    id: number,
    postData: IDataSourcePostTypes
  ) => {
    try {
      const res = await axios.put<IDataSourcePostTypes>(
        `${url}/api/v2/data-sources/${id}`,
        {
          data_source_id: id,
          datasource_name: postData.datasource_name,
          description: postData.description,
          application_type: postData.application_type,
          application_type_version: postData.application_type_version,
          last_access_synchronization_status:
            postData.last_access_synchronization_status,
          last_transaction_synchronization_status:
            postData.last_transaction_synchronization_status,
          default_datasource: postData.default_datasource,
          created_by: postData.created_by,
          last_updated_by: postData.last_updated_by,
        }
      );
      // for sync data call fetch data source
      if (res.status === 200) {
        toast({
          title: "Info !!!",
          description: `Data updated successfully.`,
        });
      }
    } catch (error: any) {
      if (error.response.status == 408) {
        toast({
          title: "Info !!!",
          description: `Can't change data already exist !.`,
        });
      }
      console.log(error);
    }
  };
  // Delete DataSource
  const deleteDataSource = async (id: number) => {
    try {
      const res = await axios.delete<IDataSourceTypes>(
        `${url}/api/v2/data-sources/${id}`
      );

      if (res.status === 200) {
        toast({
          title: "Successfully Deleted",
          description: `DataSource Name : ${res.data.datasource_name}`,
        });
      }
      console.log(res);
    } catch (error: any) {
      console.log(error);
      if (error?.status === 500) {
        toast({
          title: "Successfully Deleted",
          description: `DataSource Name : ${error.message}`,
        });
      }
    }
  };
  // Tenant IDs
  const fetchTenants = async () => {
    try {
      const res = await axios.get<ITenantsTypes[]>(`${url}/api/v2/tenants`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  // Create User
  const createUser = async (postData: IAddUserTypes) => {
    setIsLoading(true);
    const {
      user_type,
      user_name,
      email_addresses,
      created_by,
      last_updated_by,
      tenant_id,
      first_name,
      middle_name,
      last_name,
      job_title,
      password,
    } = postData;
    try {
      const res = await axios.post<IAddUserTypes>(
        `${url}/api/v2/combined-user`,
        {
          user_type,
          user_name,
          email_addresses,
          created_by,
          last_updated_by,
          tenant_id,
          first_name,
          middle_name,
          last_name,
          job_title,
          password,
        }
      );
      if (res.status === 201) {
        toast({
          title: "Info !!!",
          description: `User added successfully.`,
        });
      }
    } catch (error: any) {
      if (error.response.status) {
        toast({
          title: "Info !!!",
          description: `${error.message}`,
        });
      }
      console.log(error);
    } finally {
      setIsLoading(false);
      fetchCombinedUser();
    }
  };
  return (
    <GlobalContex.Provider
      value={{
        open,
        setOpen,
        token,
        user,
        setToken,
        users,
        fetchDataSources,
        fetchDataSource,
        isLoading,
        setIsLoading,
        createDataSource,
        updateDataSource,
        deleteDataSource,
        createUser,
        fetchTenants,
        person,
        usersInfo,
        fetchCombinedUser,
        page,
        setPage,
        totalPage,
        currentPage,
        limit,
        setLimit,
        deleteCombinedUser,
        updateUser,
        isOpenModal,
        setIsOpenModal,
        resetPassword,
        getUserInfo,
      }}
    >
      <SocketContextProvider>
        <ManageAccessEntitlementsProvider>
          <AACContextProvider>
            <Toaster />
            {children}
          </AACContextProvider>
        </ManageAccessEntitlementsProvider>
      </SocketContextProvider>
    </GlobalContex.Provider>
  );
}
