import { toast } from "@/components/ui/use-toast";
import {
  ICreateAccessPointsElementTypes,
  IFetchAccessPointsElementTypes,
  IManageAccessEntitlementsTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
interface IManageAccessEntitlementsProviderProps {
  children: React.ReactNode;
}
interface IContextTypes {
  selected: IManageAccessEntitlementsTypes[];
  setSelected: Dispatch<SetStateAction<IManageAccessEntitlementsTypes[]>>;
  fetchManageAccessEntitlements: () => Promise<
    IManageAccessEntitlementsTypes[] | undefined
  >;
  fetchAccessPointsEntitlement: (
    fetchData: IManageAccessEntitlementsTypes
  ) => Promise<void>;
  filteredData: IFetchAccessPointsElementTypes[];
  isLoading: boolean;
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  selectedManageAccessEntitlements: IManageAccessEntitlementsTypes | undefined;
  setSelectedManageAccessEntitlements: Dispatch<
    SetStateAction<IManageAccessEntitlementsTypes | undefined>
  >;
  createAccessPointsEntitlement: (
    postData: ICreateAccessPointsElementTypes
  ) => Promise<number | undefined>;
  accessPointsEntitleMaxId: number | undefined;
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
  table: any;
  setTable: Dispatch<React.SetStateAction<any>>;
  deleteAccessPointsElement: (id: number) => Promise<number | undefined>;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<IManageAccessEntitlementsTypes[]>(
    []
  );
  const [filteredData, setFilteredData] = useState<
    IFetchAccessPointsElementTypes[]
  >([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [accessPointsEntitleMaxId, setAccessPointsEntitleMaxId] = useState<
    number | undefined
  >();

  const [
    selectedManageAccessEntitlements,
    setSelectedManageAccessEntitlements,
  ] = useState<IManageAccessEntitlementsTypes>();
  const [editManageAccessEntitlement, setEditManageAccessEntitlement] =
    useState(false);
  const [mangeAccessEntitlementAction, setMangeAccessEntitlementAction] =
    useState<string>("");
  const [manageAccessEntitlementsMaxId, setManageAccessEntitlementsMaxId] =
    useState<number | undefined>(undefined);
  const [save, setSave] = useState<number>(0);
  const [table, setTable] = useState();
  //Fetch Manage Access Entitlements
  const fetchManageAccessEntitlements = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IManageAccessEntitlementsTypes[]>(
        `${url}/manage-access-entitlements`
      );
      const sortingData = response.data.sort(
        (a, b) => b.entitlement_id - a.entitlement_id
      );
      const maxID = Math.max(...sortingData.map((data) => data.entitlement_id));
      setManageAccessEntitlementsMaxId(maxID);
      return sortingData ?? [];
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch Access Points Entitlement
  const fetchAccessPointsEntitlement = async (
    fetchData: IManageAccessEntitlementsTypes
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get<IFetchAccessPointsElementTypes[]>(
        `${url}/access-points-element`
      );
      const sortingData = response.data.sort((a, b) => b?.id - a?.id);

      const filterData = sortingData.filter(
        (data) => data.entitlement_id === fetchData.entitlement_id
      );
      if (filterData.length > 0) {
        setFilteredData(filterData);
        setAccessPointsEntitleMaxId(
          Math.max(...filterData.map((item) => item.id))
        );
      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching access points entitlement:", error);
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
      effective_date,
      revison,
      revision_date,
      created_on,
      last_updated_on,
      last_updated_by,
      created_by,
    } = postData;
    setIsLoading(true);
    try {
      const res = await axios.post<IManageAccessEntitlementsTypes>(
        `${url}/manage-access-entitlements`,
        {
          entitlement_id: manageAccessEntitlementsMaxId
            ? manageAccessEntitlementsMaxId + 1
            : 0 + 1,
          entitlement_name,
          description,
          comments,
          status,
          effective_date,
          revison,
          revision_date,
          created_on,
          last_updated_on,
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
      effective_date,
      revison,
      revision_date,
      created_on,
      last_updated_on,
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
          effective_date,
          revison,
          revision_date,
          created_on,
          last_updated_on,
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
      const res = await axios.delete(`${url}/manage-access-entitlements/${id}`);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: `Deleted successfully.`,
        });
      }
      setSave((prevSave) => prevSave + 1);
    } catch (error) {
      console.log(error);
    }
  };
  // create access-points-element
  const createAccessPointsElement = async (
    postData: ICreateAccessPointsElementTypes
  ) => {
    const {
      entitlement_id,
      element_name,
      description,
      datasource,
      platform,
      element_type,
      access_control,
      change_control,
      audit,
    } = postData;
    try {
      const res = await axios.post<ICreateAccessPointsElementTypes>(
        `${url}/access-points-element`,
        {
          entitlement_id,
          element_name,
          description,
          datasource,
          platform,
          element_type,
          access_control,
          change_control,
          audit,
        }
      );
      // setSave((prevSave) => prevSave + 1);
      if (res.status === 201) {
        toast({
          title: "Success",
          description: `Add successfully.`,
        });
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
  const value = {
    fetchManageAccessEntitlements,
    setSelected,
    selected,
    fetchAccessPointsEntitlement,
    filteredData,
    isLoading,
    isOpenModal,
    setIsOpenModal,
    selectedManageAccessEntitlements,
    setSelectedManageAccessEntitlements,
    createAccessPointsEntitlement: createAccessPointsElement,
    accessPointsEntitleMaxId,
    editManageAccessEntitlement,
    setEditManageAccessEntitlement,
    mangeAccessEntitlementAction,
    setMangeAccessEntitlementAction,
    createManageAccessEntitlements,
    updateManageAccessEntitlements,
    deleteManageAccessEntitlement,
    save,
    setSave,
    table,
    setTable,
    deleteAccessPointsElement,
  };

  return (
    <ManageAccessEntitlements.Provider value={value}>
      {children}
    </ManageAccessEntitlements.Provider>
  );
};
