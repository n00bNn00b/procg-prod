import { toast } from "@/components/ui/use-toast";
import {
  IManageGlobalConditionLogicAttributesTypes,
  IManageGlobalConditionLogicExtendTypes,
  IManageGlobalConditionLogicTypes,
  IManageGlobalConditionTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
interface IAACContextProviderProps {
  children: React.ReactNode;
}
interface IAACContextTypes {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  stateChange: number;
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
  isOpenManageGlobalConditionModal: boolean;
  setIsOpenManageGlobalConditionModal: Dispatch<SetStateAction<boolean>>;
  fetchManageGlobalConditions: () => Promise<void>;
  manageGlobalConditions: IManageGlobalConditionTypes[];
  selectedManageGlobalConditionItem: IManageGlobalConditionTypes[];
  setSelectedManageGlobalConditionItem: Dispatch<
    SetStateAction<IManageGlobalConditionTypes[]>
  >;
  createManageGlobalCondition: (
    postData: IManageGlobalConditionTypes
  ) => Promise<void>;
  fetchManageGlobalConditionLogics: (
    filterId: number
  ) => Promise<IManageGlobalConditionLogicExtendTypes[] | undefined>;
  manageGlobalConditionTopicData: IManageGlobalConditionLogicExtendTypes[];
  setManageGlobalConditionTopicData: Dispatch<
    SetStateAction<IManageGlobalConditionLogicExtendTypes[]>
  >;
  deleteLogicAndAttributeData: (
    logicId: number,
    attrId: number
  ) => Promise<number | undefined>;
}
export const AACContext = createContext<IAACContextTypes | null>(null);

export const useAACContext = () => {
  const consumer = useContext(AACContext);
  if (!consumer) {
    throw new Error("error");
  }
  return consumer;
};
export const AACContextProvider = ({ children }: IAACContextProviderProps) => {
  const url = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stateChange, setStateChange] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [
    isOpenManageGlobalConditionModal,
    setIsOpenManageGlobalConditionModal,
  ] = useState<boolean>(false);
  const [manageGlobalConditions, setManageGlobalConditions] = useState<
    IManageGlobalConditionTypes[]
  >([]);
  const [
    selectedManageGlobalConditionItem,
    setSelectedManageGlobalConditionItem,
  ] = useState<IManageGlobalConditionTypes[]>([]);
  const [manageGlobalConditionTopicData, setManageGlobalConditionTopicData] =
    useState<IManageGlobalConditionLogicExtendTypes[]>([]);
  console.log(manageGlobalConditionTopicData);
  // Fetch Manage Global Conditions
  const fetchManageGlobalConditions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<IManageGlobalConditionTypes[]>(
        `${url}/manage-global-conditions`
      );
      if (response) {
        const sortedData = response.data.sort(
          (a, b) => b.manage_global_condition_id - a.manage_global_condition_id
        );
        return setManageGlobalConditions(sortedData ?? []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Create Manage Global Condition
  const createManageGlobalCondition = async (
    postData: IManageGlobalConditionTypes
  ) => {
    try {
      setIsLoading(true);
      const {
        manage_global_condition_id,
        name,
        description,
        datasource,
        status,
      } = postData;
      const res = await axios.post<IManageGlobalConditionTypes>(
        `${url}/manage-global-conditions`,
        { manage_global_condition_id, name, description, datasource, status }
      );
      if (res.status === 201) {
        setStateChange((prev) => prev + 1);
        toast({
          title: "Success",
          description: `Added successfully.`,
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 408) {
        toast({
          title: "Info",
          description: `${error.response.data.message}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch Manage Global Conditions
  const fetchManageGlobalConditionLogics = async (filterId: number) => {
    try {
      setIsLoading(true);
      const [logicsRes, attributesRes] = await Promise.all([
        axios.get<IManageGlobalConditionLogicTypes[]>(
          `${url}/manage-global-condition-logics`
        ),
        axios.get<IManageGlobalConditionLogicAttributesTypes[]>(
          `${url}/manage-global-condition-logic-attributes`
        ),
      ]);
      const attributesMap = new Map(
        attributesRes.data.map((attr) => [
          attr.manage_global_condition_logic_id,
          attr,
        ])
      );
      const mergedData = logicsRes.data.map((item) => ({
        ...item,
        ...(attributesMap.get(item.manage_global_condition_logic_id) || {}),
      }));

      console.log(logicsRes, attributesRes, "mergedData");
      const filteredData = mergedData.filter(
        (item) => item.manage_global_condition_id === filterId
      );
      // return (filteredData as IManageGlobalConditionLogicExtendTypes[]) ?? [];
      if (filteredData) {
        const sortedData = filteredData.sort(
          (a, b) => Number(a.widget_position) - Number(b.widget_position)
        );
        console.log(sortedData, "sortedData");
        return sortedData as IManageGlobalConditionLogicExtendTypes[];
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLogicAndAttributeData = async (
    logicId: number,
    attrId: number
  ) => {
    try {
      const [isExistLogicId, isExistAttrId] = await Promise.all([
        axios.get(
          `http://localhost:3000/manage-global-condition-logics/${logicId}`
        ),
        axios.get(
          `http://localhost:3000/manage-global-condition-logic-attributes/${attrId}`
        ),
      ]);
      if (isExistLogicId.status === 200 && isExistAttrId.status === 200) {
        return isExistLogicId.status;
      }
    } catch (error: any) {
      return error.response.status;
    }
  };
  const value = {
    isLoading,
    setIsLoading,
    stateChange,
    isEditModalOpen,
    setIsEditModalOpen,
    isOpenManageGlobalConditionModal,
    setIsOpenManageGlobalConditionModal,
    fetchManageGlobalConditions,
    manageGlobalConditions,
    selectedManageGlobalConditionItem,
    setSelectedManageGlobalConditionItem,
    createManageGlobalCondition,
    fetchManageGlobalConditionLogics,
    manageGlobalConditionTopicData,
    setManageGlobalConditionTopicData,
    deleteLogicAndAttributeData,
  };
  return <AACContext.Provider value={value}>{children}</AACContext.Provider>;
};
