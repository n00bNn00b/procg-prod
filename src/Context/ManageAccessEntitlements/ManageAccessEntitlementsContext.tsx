import { toast } from "@/components/ui/use-toast";
import {
  ICreateAccessPointsElementTypes,
  IFetchAccessPointsElementTypes,
  IFetchAccessEntitlementElementsTypes,
  IManageAccessEntitlementsTypes,
  IManageAccessEntitlementsPerPageTypes,
  IFetchCombinedAccessPointsElementAndDatasourceTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
interface IManageAccessEntitlementsProviderProps {
  children: React.ReactNode;
}
interface IContextTypes {
  selected: IManageAccessEntitlementsTypes[];
  setSelected: Dispatch<SetStateAction<IManageAccessEntitlementsTypes[]>>;
  fetchManageAccessEntitlements: (
    page: number,
    limit: number
  ) => Promise<IManageAccessEntitlementsPerPageTypes | undefined>;
  fetchAccessPointsEntitlement: (
    fetchData: IManageAccessEntitlementsTypes
  ) => Promise<void>;
  fetchAccessPointsEntitlementForDelete: (
    fetchData: IManageAccessEntitlementsTypes
  ) => Promise<IFetchAccessPointsElementTypes[]>;
  filteredData: IFetchCombinedAccessPointsElementAndDatasourceTypes[];
  setFilteredData: Dispatch<
    SetStateAction<IFetchCombinedAccessPointsElementAndDatasourceTypes[] | []>
  >;
  isLoading: boolean;
  isLoadingAccessPoints: boolean;
  selectedRow: ICreateAccessPointsElementTypes[];
  setSelectedRow: Dispatch<SetStateAction<ICreateAccessPointsElementTypes[]>>;
  selectedManageAccessEntitlements: IManageAccessEntitlementsTypes | undefined;
  setSelectedManageAccessEntitlements: Dispatch<
    SetStateAction<IManageAccessEntitlementsTypes | undefined>
  >;
  createAccessPointsEntitlement: (
    postData: ICreateAccessPointsElementTypes
  ) => Promise<number | undefined>;
  editManageAccessEntitlement: boolean;
  setEditManageAccessEntitlement: Dispatch<SetStateAction<boolean>>;
  mangeAccessEntitlementAction: string;
  setMangeAccessEntitlementAction: Dispatch<SetStateAction<string>>;
  createManageAccessEntitlements: (
    postData: IManageAccessEntitlementsTypes
  ) => Promise<void>;
  updateManageAccessEntitlements: (
    id: number,
    putData: IManageAccessEntitlementsTypes
  ) => Promise<void>;
  deleteManageAccessEntitlement: (id: number) => Promise<void>;
  save: number;
  setSave: Dispatch<SetStateAction<number>>;
  save2: number;
  setSave2: Dispatch<SetStateAction<number>>;
  table: any;
  setTable: Dispatch<React.SetStateAction<any>>;
  deleteAccessPointsElement: (id: number) => Promise<number | undefined>;
  createAccessEntitlementElements: (
    entitlement_id: number,
    accessPointsMaxId: (number | undefined)[]
  ) => Promise<void>;
  deleteAccessEntitlementElement: (
    entitlementId: number,
    accessPointId: number
  ) => Promise<void>;
  editAccessPoint: boolean;
  setEditAccessPoint: Dispatch<SetStateAction<boolean>>;
  accessPointStatus: string;
  setAccessPointStatus: Dispatch<SetStateAction<string>>;
  fetchAccessPointsData: () => Promise<
    IFetchAccessPointsElementTypes[] | undefined
  >;
  fetchAccessEtitlementElenents: () => Promise<
    IFetchAccessEntitlementElementsTypes[] | [] | undefined
  >;
  accessPoints: ICreateAccessPointsElementTypes[] | undefined;
  selectedAccessEntitlementElements: number[];
  setSelectedAccessEntitlementElements: Dispatch<SetStateAction<number[] | []>>;
  //lazy loading
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  currentPage: number;
  limit: number;
  setLimit: (number: number) => void;
}
export const ManageAccessEntitlements = createContext<IContextTypes | null>(
  null
);
export const useManageAccessEntitlementsContext = () => {
  const consumer = useContext(ManageAccessEntitlements);
  if (!consumer) {
    throw new Error("error");
  }
  return consumer;
};
export const ManageAccessEntitlementsProvider = ({
  children,
}: IManageAccessEntitlementsProviderProps) => {
  const url = import.meta.env.VITE_API_URL;
  const { token } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingAccessPoints, setIsLoadingAccessPoints] =
    useState<boolean>(false);
  const [selected, setSelected] = useState<IManageAccessEntitlementsTypes[]>(
    []
  );
  const [filteredData, setFilteredData] = useState<
    IFetchCombinedAccessPointsElementAndDatasourceTypes[] | []
  >([]);
  const [selectedRow, setSelectedRow] = useState<
    ICreateAccessPointsElementTypes[]
  >([]);
  const [
    selectedManageAccessEntitlements,
    setSelectedManageAccessEntitlements,
  ] = useState<IManageAccessEntitlementsTypes>();
  const [editManageAccessEntitlement, setEditManageAccessEntitlement] =
    useState(false);
  const [mangeAccessEntitlementAction, setMangeAccessEntitlementAction] =
    useState<string>("");
  const [save, setSave] = useState<number>(0);
  const [save2, setSave2] = useState<number>(0);
  const [table, setTable] = useState();
  const [editAccessPoint, setEditAccessPoint] = useState<boolean>(false);
  const [accessPointStatus, setAccessPointStatus] = useState<string>("");
  const [accessPoints, setAccessPoints] = useState<
    ICreateAccessPointsElementTypes[] | undefined
  >([]);
  const [
    selectedAccessEntitlementElements,
    setSelectedAccessEntitlementElements,
  ] = useState<number[]>([]);
  //Fetch Manage Access Entitlements
  const fetchManageAccessEntitlements = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get<IManageAccessEntitlementsPerPageTypes>(
        `${url}/api/v2/manage-access-entitlements/${page}/${limit}`
      );
      const sortingData = response.data;
      return sortingData ?? {};
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // fetch access points element data
  const fetchAccessPointsData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IFetchAccessPointsElementTypes[]>(
        `${url}/api/v2/access-points-element`
      );
      setAccessPoints(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalPage, setTotalPage] = useState<number>(Number());
  const [currentPage, setCurrentPage] = useState<number>(1);
  // access entitlement elements lazy loading
  // const fetchAccessEtitlementElenentsLazyLoading = useCallback(
  //   async (data: IFetchAccessPointsElementTypes[]) => {
  //     try {
  //       const totalCount = data.length;
  //       const offset = (page - 1) * limit;
  //       const results = data.slice(offset, offset + limit);
  //       const totalPages = Math.ceil(totalCount / limit);
  //       setFilteredData(results);
  //       setTotalPage(totalPages);
  //       setCurrentPage(page);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   [page, limit]
  // );
  // Fetch Access Points Entitlement
  const fetchAccessPointsEntitlement = useCallback(
    async (fetchData: IManageAccessEntitlementsTypes) => {
      setIsLoading(true);
      try {
        if (fetchData) {
          const response = await axios.get<
            IFetchAccessEntitlementElementsTypes[]
          >(
            `${url}/api/v2/access-entitlement-elements/${fetchData.entitlement_id}`
          );
          const accessPointsId = response.data.map(
            (data) => data.access_point_id
          );

          // fetch access points data by IDS array
          const filterAccessPointsById = await axios.get(
            `${url}/api/v2/access-points-element/ids?ids=${accessPointsId}&page=${page}&limit=${limit}`
          );
          const totalCount = response.data.length;
          const totalPages = Math.ceil(totalCount / limit);
          setTotalPage(totalPages);
          setCurrentPage(page);
          setFilteredData(
            filterAccessPointsById.data as IFetchCombinedAccessPointsElementAndDatasourceTypes[]
          );
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );
  const fetchAccessPointsEntitlementForDelete = useCallback(
    async (fetchData: IManageAccessEntitlementsTypes) => {
      setFilteredData([]);
      // setIsLoading(true);
      try {
        if (fetchData) {
          const response = await axios.get<
            IFetchAccessEntitlementElementsTypes[]
          >(
            `${url}/api/v2/access-entitlement-elements/${fetchData.entitlement_id}`
          );
          const accessPointsId = response.data.map(
            (data) => data.access_point_id
          );

          // fetch access points data by IDS array
          const filterAccessPointsById = await axios.get(
            `${url}/api/v2/access-points-element/ids?ids=${accessPointsId}&page=${page}&limit=${limit}`
          );
          return filterAccessPointsById.data ?? [];
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );
  // create manage-access-entitlement
  const createManageAccessEntitlements = async (
    postData: IManageAccessEntitlementsTypes
  ) => {
    const {
      entitlement_name,
      description,
      comments,
      status,
      last_updated_by,
      created_by,
    } = postData;
    setIsLoading(true);
    try {
      const res = await axios.post<IManageAccessEntitlementsTypes>(
        `${url}/api/v2/manage-access-entitlements`,
        {
          entitlement_name,
          description,
          comments,
          status,
          last_updated_by,
          created_by,
        }
      );
      if (res.status === 201) {
        toast({
          title: "Info !!!",
          description: `User added successfully.`,
        });
        setEditManageAccessEntitlement(false);
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
      setSave((prevSave) => prevSave + 1);
      setIsLoading(false);
    }
  };
  // update manage-access-entitlement
  const updateManageAccessEntitlements = async (
    id: number,
    putData: IManageAccessEntitlementsTypes
  ) => {
    setIsLoading(true);
    const {
      entitlement_id,
      entitlement_name,
      description,
      comments,
      status,
      last_updated_by,
      created_by,
    } = putData;
    try {
      const res = await axios.put<IManageAccessEntitlementsTypes>(
        `${url}/api/v2/manage-access-entitlements/${id}`,
        {
          entitlement_id,
          entitlement_name,
          description,
          comments,
          status,
          last_updated_by,
          created_by,
        }
      );

      if (res.status === 200) {
        toast({
          title: "Info !!!",
          description: `Update successfully.`,
        });
        setEditManageAccessEntitlement(false);
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
      setSave((prevSave) => prevSave + 1);
      setIsLoading(false);
    }
  };
  const deleteManageAccessEntitlement = async (id: number) => {
    try {
      //fetch access entitlements
      const response = await axios.get(
        `${url}/api/v2/access-entitlement-elements/${id}`
      );
      console.log(response.data, "response");
      if (response.data.length > 0) {
        for (const element of response.data) {
          await deleteAccessEntitlementElement(
            element.entitlement_id,
            element.access_point_id
          );
        }
      }
      const res = await axios.delete(
        `${url}/api/v2/manage-access-entitlements/${id}`
      );
      if (res.status === 200) {
        toast({
          title: "Info !!!",
          description: `Data deleted successfully.`,
        });
      }
      setSave((prevSave) => prevSave + 1);
    } catch (error) {
      console.log(error);
    }
  };
  // create access-points-element
  const createAccessPointsEntitlement = async (
    postData: ICreateAccessPointsElementTypes
  ) => {
    const {
      data_source_id,
      element_name,
      description,
      platform,
      element_type,
      access_control,
      change_control,
      audit,
      created_by,
      last_updated_by,
    } = postData;
    try {
      setIsLoading(true);
      const res = await axios.post<ICreateAccessPointsElementTypes>(
        `${url}/api/v2/access-points-element`,
        {
          data_source_id,
          element_name,
          description,
          platform,
          element_type,
          access_control,
          change_control,
          audit,
          created_by,
          last_updated_by,
        }
      );
      // setSave((prevSave) => prevSave + 1);
      if (res.status === 201) {
        toast({
          title: "Info !!!",
          description: `Add successfully.`,
        });
        setSave2((prevSave) => prevSave + 1);
      }
      return res.status;
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
      setSave2((prevSave) => prevSave + 1);
    }
  };
  // delete access-points-element
  const deleteAccessPointsElement = async (id: number) => {
    try {
      const res = await axios.delete(
        `${url}/api/v2/access-points-element/${id}`
      );
      if (res.status === 200) {
        toast({
          title: "Info !!!",
          description: `Deleted successfully.`,
        });
      }
      // setSave((prevSave) => prevSave + 1);
      return res.status;
    } catch (error) {
      console.log(error);
    }
  };
  //fetch access entitlement elements
  const fetchAccessEtitlementElenents = async () => {
    const res = await axios.get<IFetchAccessEntitlementElementsTypes[]>(
      `${url}/api/v2/access-entitlement-elements`
    );
    return res.data;
  };
  //create access entitlement elements
  const createAccessEntitlementElements = async (
    entitlement_id: number,
    accessPointsMaxId: (number | undefined)[]
  ) => {
    //post data
    try {
      setIsLoadingAccessPoints(true);
      for (const id of accessPointsMaxId) {
        await axios.post<IFetchAccessEntitlementElementsTypes>(
          `${url}/api/v2/access-entitlement-elements`,
          {
            entitlement_id: entitlement_id,
            access_point_id: id,
            created_by: token.user_name,
            last_updated_by: token.user_name,
          }
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAccessPoints(false);
      toast({
        title: "Info !!!",
        description: `Data added successfully to ${selectedManageAccessEntitlements?.entitlement_name}`,
      });
    }

    fetchAccessPointsEntitlement(selected[0]);
  };
  const deleteAccessEntitlementElement = async (
    entitlementId: number,
    accessPointId: number
  ) => {
    setIsLoadingAccessPoints(true);
    try {
      await Promise.all([
        await axios
          .delete(`${url}/api/v2/access-entitlement-elements`, {
            data: { entitlementId, accessPointId },
          })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            fetchAccessPointsEntitlementForDelete(selected[0]);
          }),
        // await axios.delete(`${url}/api/v2/access-points-element/${accessPointId}`),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAccessPoints(false);
    }
  };
  const value = {
    fetchManageAccessEntitlements,
    setSelected,
    selected,
    fetchAccessPointsEntitlement,
    fetchAccessPointsEntitlementForDelete,
    filteredData,
    setFilteredData,
    isLoading,
    isLoadingAccessPoints,
    selectedRow,
    setSelectedRow,
    selectedManageAccessEntitlements,
    setSelectedManageAccessEntitlements,
    createAccessPointsEntitlement,
    editManageAccessEntitlement,
    setEditManageAccessEntitlement,
    mangeAccessEntitlementAction,
    setMangeAccessEntitlementAction,
    createManageAccessEntitlements,
    updateManageAccessEntitlements,
    deleteManageAccessEntitlement,
    save,
    setSave,
    save2,
    setSave2,
    table,
    setTable,
    deleteAccessPointsElement,
    createAccessEntitlementElements,
    deleteAccessEntitlementElement,
    editAccessPoint,
    setEditAccessPoint,
    accessPointStatus,
    setAccessPointStatus,
    fetchAccessPointsData,
    fetchAccessEtitlementElenents,
    accessPoints,
    selectedAccessEntitlementElements,
    setSelectedAccessEntitlementElements,
    page,
    setPage,
    totalPage,
    currentPage,
    limit,
    setLimit,
  };

  return (
    <ManageAccessEntitlements.Provider value={value}>
      {children}
    </ManageAccessEntitlements.Provider>
  );
};
