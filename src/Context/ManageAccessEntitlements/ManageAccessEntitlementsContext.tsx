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
    id: IManageAccessEntitlementsTypes
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
  ) => Promise<void>;
  accessPointsEntitleMaxId: number | undefined;
  editManageAccessEntitlement: boolean;
  setEditManageAccessEntitlement: Dispatch<SetStateAction<boolean>>;
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
  console.log(selectedManageAccessEntitlements);
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
      return sortingData ?? [];
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch Access Points Entitlement
  const fetchAccessPointsEntitlement = async (
    id: IManageAccessEntitlementsTypes
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get<IFetchAccessPointsElementTypes[]>(
        `${url}/access-points-element`
      );
      const sortingData = response.data.sort((a, b) => b?.id - a?.id);

      const filterData = sortingData.filter(
        (data) => data.entitlement_id === id.entitlement_id
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
  // create access-points-element
  const createAccessPointsEntitlement = async (
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
      if (res.status === 201) {
        toast({
          title: "Success",
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
    createAccessPointsEntitlement,
    accessPointsEntitleMaxId,
    editManageAccessEntitlement,
    setEditManageAccessEntitlement,
  };

  return (
    <ManageAccessEntitlements.Provider value={value}>
      {children}
    </ManageAccessEntitlements.Provider>
  );
};
