import {
  IAccessPointsEntitlementTypes,
  IManageAccessEntitlementsTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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
  fetchAccessPointsEntitlement: (id: number) => Promise<void>;
  filteredData: IAccessPointsEntitlementTypes[];
  isLoading: boolean;
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
    IAccessPointsEntitlementTypes[]
  >([]);
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
      setIsLoading(false);
      return sortingData ?? [];
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch Access Points Entitlement
  const fetchAccessPointsEntitlement = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get<IAccessPointsEntitlementTypes[]>(
        `${url}/access-points-entitlement`
      );
      const sortingData = response.data.sort((a, b) => b.id - a.id);

      const filterData = sortingData.filter(
        (data) => data.entitlement_id === id
      );
      if (filterData.length > 0) {
        setFilteredData(filterData);
        setIsLoading(false);
      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching access points entitlement:", error);
    }
  };

  const value = {
    fetchManageAccessEntitlements,
    setSelected,
    selected,
    fetchAccessPointsEntitlement,
    filteredData,
    isLoading,
  };

  return (
    <ManageAccessEntitlements.Provider value={value}>
      {children}
    </ManageAccessEntitlements.Provider>
  );
};
