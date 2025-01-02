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
  IUsersInfoTypes,
  IUpdateUserTypes,
  IUserPasswordResetTypes,
  IUserLinkedDevices,
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
import { detect } from "detect-browser";

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
  isCombinedUserLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createDataSource: (postData: IDataSourcePostTypes) => Promise<void>;
  updateDataSource: (
    id: number,
    postData: IDataSourcePostTypes
  ) => Promise<void>;
  deleteDataSource: (id: number) => Promise<void>;
  createUser: (postData: IAddUserTypes) => void;
  fetchTenants: () => Promise<ITenantsTypes[] | undefined>;
  combinedUser: IUsersInfoTypes | undefined;
  setCombinedUser: React.Dispatch<
    React.SetStateAction<IUsersInfoTypes | undefined>
  >;
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
  isUserLoading: boolean;
  presentDevice: IUserLinkedDevices;
}
export const userExample = {
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

const browser = detect();
const userAgent = navigator.userAgent;

const deviceInfo = {
  device_type: /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop",
  browser_name: browser?.name || "Unknown",
  browser_version: browser?.version || "Unknown",
  os: browser?.os || "Unknown",
  user_agent: userAgent,
  is_active: 1,
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

  const [users, setUsers] = useState<Users[]>([]);
  const [combinedUser, setCombinedUser] = useState<IUsersInfoTypes>();
  const [isCombinedUserLoading, setIsCombinedUserLoading] = useState(true);
  const [usersInfo, setUsersInfo] = useState<IUsersInfoTypes[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = token?.user_name || "";

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const presentDevice = deviceInfo;

  //get user
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get<Token>("/auth/user");
        setToken(res.data);
      } catch (error) {
        console.log("Please login.");
      } finally {
        setIsUserLoading(false);
      }
    };
    getUser();
  }, [api, token?.user_id]);

  //Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (token?.user_id === 0) return;
        const [users, combinedUser] = await Promise.all([
          api.get<Users[]>(`/users`),
          api.get<IUsersInfoTypes>(`/combined-user/${token?.user_id}`),
        ]);
        setCombinedUser(combinedUser?.data);
        setUsers(users.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsCombinedUserLoading(false);
      }
    };

    fetchUsers();
  }, [api, token?.user_id, combinedUser?.profile_picture]);

  // access entitlement elements lazy loading
  const fetchCombinedUser = async () => {
    try {
      setIsLoading(true);
      const users = await api.get<Users[]>(`/users`);
      const res = await api.get<IUsersInfoTypes[]>(
        `/combined-user/${page}/${limit}`
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
      const res = await api.post<IAddUserTypes>(`/combined-user`, {
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
      const res = await api.put(`/combined-user/${id}`, userInfo);
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
      const res = await api.put(`/user-credentials/reset-password`, resetData);

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
          api.delete(`/users/${id.user_id}`),
          api.delete(`/persons/${id.user_id}`),
          api.delete(`/user-credentials/${id.user_id}`),
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
        `/data-sources/${page}/${limit}`
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
      const response = await api.get<IDataSourceTypes>(`/data-sources/${id}`);
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
      const res = await api.post<IDataSourceTypes>(`/data-sources`, {
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
      const res = await api.put<IDataSourcePostTypes>(`/data-sources/${id}`, {
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
      });
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
      const res = await api.delete<IDataSourceTypes>(`/data-sources/${id}`);

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
      const res = await api.get<ITenantsTypes[]>(`/tenants`);
      return res.data;
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
        user,
        setToken,
        users,
        fetchDataSources,
        fetchDataSource,
        isLoading,
        isCombinedUserLoading,
        setIsLoading,
        createDataSource,
        updateDataSource,
        deleteDataSource,
        createUser,
        fetchTenants,
        combinedUser,
        setCombinedUser,
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
        isUserLoading,
        presentDevice,
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
