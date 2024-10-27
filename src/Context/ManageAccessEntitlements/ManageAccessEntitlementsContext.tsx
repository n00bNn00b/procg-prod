import { toast } from "@/components/ui/use-toast";
import {
  ICreateAccessPointsElementTypes,
  IFetchAccessPointsElementTypes,
  IFetchAccessEntitlementElementsTypes,
  IManageAccessEntitlementsTypes,
  IManageAccessEntitlementsPerPageTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
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
  ) => Promise<IFetchAccessPointsElementTypes[] | undefined>;
  filteredData: IFetchAccessPointsElementTypes[];
  setFilteredData: Dispatch<
    SetStateAction<IFetchAccessPointsElementTypes[] | []>
  >;
  isLoading: boolean;
  isOpenModal: number;
  selectedRow: ICreateAccessPointsElementTypes[];
  setSelectedRow: Dispatch<SetStateAction<ICreateAccessPointsElementTypes[]>>;
  setIsOpenModal: Dispatch<SetStateAction<number>>;
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
  setPage: (number: number) => void;
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
  const [selected, setSelected] = useState<IManageAccessEntitlementsTypes[]>(
    []
  );
  const [filteredData, setFilteredData] = useState<
    IFetchAccessPointsElementTypes[] | []
  >([]);
  const [isOpenModal, setIsOpenModal] = useState<number>(0);
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
        `${url}/manage-access-entitlements/p?page=${page}&limit=${limit}`
      );
      // const sortingData = response.data.sort(
      //   (a, b) => b.entitlement_id - a.entitlement_id
      // );
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
    try {
      const response = await axios.get<IFetchAccessPointsElementTypes[]>(
        `${url}/access-points-element`
      );
      setAccessPoints(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(3);
  const [totalPage, setTotalPage] = useState<number>(Number());
  const [currentPage, setCurrentPage] = useState<number>(1);
  // access entitlement elements lazy loading
  const fetchAccessEtitlementElenentsLazyLoading = async (
    data: IFetchAccessPointsElementTypes[]
  ) => {
    try {
      const totalCount = data.length;
      const offset = (page - 1) * limit;
      const results = data.slice(offset, offset + limit);
      const totalPages = Math.ceil(totalCount / limit);
      setFilteredData(results);
      setTotalPage(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch Access Points Entitlement
  const fetchAccessPointsEntitlement = async (
    fetchData: IManageAccessEntitlementsTypes
  ) => {
    setIsLoading(true);
    try {
      if (fetchData) {
        const response = await axios.get<
          IFetchAccessEntitlementElementsTypes[]
        >(`${url}/access-entitlement-elements/${fetchData.entitlement_id}`);
        const accessPointsId = response.data.map(
          (data) => data.access_point_id
        );

        //fetch access points data
        const accessPointsData = await Promise.all(
          accessPointsId.map(async (id) => {
            const response = await axios.get<IFetchAccessPointsElementTypes>(
              `${url}/access-points-element/${id}`
            );
            return response.data;
          })
        );
        if (accessPointsData.length > 0) {
          const sortingData = accessPointsData.sort(
            (a, b) => b?.access_point_id - a?.access_point_id
          );
          fetchAccessEtitlementElenentsLazyLoading(sortingData);
          return sortingData ?? [];
        } else {
          setFilteredData([]);
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
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
        `${url}/manage-access-entitlements`,
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
          title: "Success",
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
        `${url}/manage-access-entitlements/${id}`,
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
          title: "Success",
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
        `${url}/access-entitlement-elements/${id}`
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
      const res = await axios.delete(`${url}/manage-access-entitlements/${id}`);
      if (res.status === 200) {
        toast({
          title: "Success",
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
        `${url}/access-points-element`,
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
          title: "Success",
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
      const res = await axios.delete(`${url}/access-points-element/${id}`);
      if (res.status === 200) {
        toast({
          title: "Success",
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
      `${url}/access-entitlement-elements`
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
      for (const id of accessPointsMaxId) {
        await axios.post<IFetchAccessEntitlementElementsTypes>(
          `${url}/access-entitlement-elements`,
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
    }

    fetchAccessPointsEntitlement(selected[0]);
  };
  const deleteAccessEntitlementElement = async (
    entitlementId: number,
    accessPointId: number
  ) => {
    await Promise.all([
      await axios
        .delete(`${url}/access-entitlement-elements`, {
          data: { entitlementId, accessPointId },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          fetchAccessPointsEntitlement(selected[0]);
        }),
      // await axios.delete(`${url}/access-points-element/${accessPointId}`),
    ]);
  };
  const value = {
    fetchManageAccessEntitlements,
    setSelected,
    selected,
    fetchAccessPointsEntitlement,
    filteredData,
    setFilteredData,
    isLoading,
    isOpenModal,
    selectedRow,
    setSelectedRow,
    setIsOpenModal,
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
