import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AxiosError } from "axios";
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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Navigate } from "react-router-dom";

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
  isUserLoading: boolean;
}
const userExample = {
  isLoggedIn: false,
  user_id: 0,
  user_name: "",
  user_type: "",
  tenant_id: 0,
  access_token: "",
  issuedAt: "",
  iat: 0,
  exp: 0,
};
const GlobalContex = createContext({} as GlobalContex);

export function useGlobalContext() {
  return useContext(GlobalContex);
}

export function GlobalContextProvider({
  children,
}: GlobalContextProviderProps) {
  // const { setIsOpenModal } = useManageAccessEntitlementsContext();
  const api = useAxiosPrivate();
  const [open, setOpen] = useState<boolean>(false);
  const [token, setToken] = useState<Token>(userExample);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const storeData = localStorage.getItem("loggedInUser");
        if (storeData) {
          const localData = JSON.parse(storeData);
          if (!localData) return console.log("Please Login ");
          const res = await api.get<Token>("/auth/user");
          console.log(res, "res");
          if (res?.status === 200) {
            setToken(res.data);
          } else if (res?.status === 500) {
            console.log(res, "res");
            localStorage.setItem("loggedInUser", JSON.stringify(false));
            setToken(userExample);
            return <Navigate to="/login" />;
          }
        }
      } catch (error) {
        localStorage.setItem("loggedInUser", JSON.stringify(false));
        setToken(userExample);
        console.log(error);
      } finally {
        setIsUserLoading(false);
      }
    };
    getUser();
  }, []);
  // const [token, setToken] = useState<Token>(() => {
  //   const storeData = localStorage.getItem("token");
  //   if (storeData) {
  //     try {
  //       const userData = JSON.parse(storeData);
  //       return userData;
  //     } catch (error) {
  //       console.error("Error parsing stored access token:", error);
  //       return null;
  //     }
  //   }
  //   return null;
  // });

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
        const users = await api.get<Users[]>(`${url}/users`);
        if (token?.user_id) {
          const res = async () => {
            const person = await api.get<IPersonsTypes>(
              `${url}/persons/${token?.user_id}`
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
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // access entitlement elements lazy loading
  const fetchCombinedUser = async () => {
    try {
      setIsLoading(true);
      const users = await api.get<Users[]>(`${url}/users`);
      const res = await api.get<IUsersInfoTypes[]>(
        `${url}/combined-user/${page}/${limit}`
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
      const res = await api.get<IUsersInfoTypes>(
        `${url}/combined-user/${user_id}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
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
      const res = await api.post<IAddUserTypes>(`${url}/combined-user`, {
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
      });
      if (res.status === 201) {
        setIsLoading(false);
        toast({
          title: "Info !!!",
          description: `User added successfully.`,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status) {
          toast({
            title: "Info !!!",
            description: `${error.message}`,
          });
        }
      }

      console.log(error);
    } finally {
      fetchCombinedUser();
    }
  };
  const updateUser = async (id: number, userInfo: IUpdateUserTypes) => {
    setIsLoading(true);
    try {
      const res = await api.put(`${url}/combined-user/${id}`, userInfo);
      if (res.status === 200) {
        setIsLoading(false);
        setIsOpenModal("");
        fetchCombinedUser();
        toast({
          title: "Info !!!",
          description: `Update successfully.`,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchCombinedUser();
    }
  };
  // reset password
  const resetPassword = async (resetData: IUserPasswordResetTypes) => {
    try {
      setIsLoading(true);
      const res = await api.put(
        `${url}/user-credentials/reset-password`,
        resetData
      );

      if (res.status === 200) {
        toast({
          title: "Info !!!",
          description: `Reset password successfully.`,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          title: "Info !!!",
          variant: "destructive",
          description: `${error.response.data.message}`,
        });
      }

      return;
    } finally {
      setIsLoading(false);
    }
  };
  const deleteCombinedUser = async (user_ids: IUsersInfoTypes[]) => {
    setIsLoading(true);
    try {
      for (const id of user_ids) {
        const [users, persons, credentials] = await Promise.all([
          api.delete(`${url}/users/${id.user_id}`),
          api.delete(`${url}/persons/${id.user_id}`),
          api.delete(`${url}/user-credentials/${id.user_id}`),
        ]);
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
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        fetchCombinedUser();
        toast({
          title: "Info !!!",
          description: `Error: ${error.message}`,
        });
      }
    } finally {
      fetchCombinedUser();
      setIsLoading(false);
    }
  };
  //Fetch DataSources
  const fetchDataSources = async (page: number, limit: number) => {
    try {
      const response = await api.get<IManageAccessEntitlementsPerPageTypes>(
        `${url}/data-sources/${page}/${limit}`
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
      const response = await api.get<IDataSourceTypes>(
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
      const res = await api.post<IDataSourceTypes>(`${url}/data-sources`, {
        datasource_name,
        description,
        application_type,
        application_type_version,
        last_access_synchronization_status,
        last_transaction_synchronization_status,
        default_datasource,
        created_by,
        last_updated_by,
      });
      // for sync data call fetch data source
      console.log(res.status);
      if (res.status === 201) {
        toast({
          title: "Info !!!",
          description: `Data added successfully.`,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 408) {
          toast({
            title: "Info !!!",
            description: `Can't add data already exist !.`,
          });
        }
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
      const res = await api.put<IDataSourcePostTypes>(
        `${url}/data-sources/${id}`,
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
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status == 408) {
          toast({
            title: "Info !!!",
            description: `Can't change data already exist !.`,
          });
        }
      }

      console.log(error);
    }
  };
  // Delete DataSource
  const deleteDataSource = async (id: number) => {
    try {
      const res = await api.delete<IDataSourceTypes>(
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
      if (error instanceof AxiosError && error.response) {
        if (error?.status === 500) {
          toast({
            title: "Successfully Deleted",
            description: `DataSource Name : ${error.message}`,
          });
        }
      }
      console.log(error);
    }
  };
  // Tenant IDs
  const fetchTenants = async () => {
    try {
      const res = await api.get<ITenantsTypes[]>(`${url}/tenants`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  // Create User

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
        isUserLoading,
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
