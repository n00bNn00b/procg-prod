import { toast } from "@/components/ui/use-toast";
import {
  IManageAccessModelLogicAttributesTypes,
  IManageAccessModelLogicExtendTypes,
  IManageAccessModelLogicsTypes,
  IManageAccessModelSearchFilterTypes,
  IManageAccessModelsTypes,
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
  useEffect,
  useState,
} from "react";
import { ControlsContextProvider } from "./ManageControlsContext";
import { IDataSourceTypes } from "@/types/interfaces/datasource.interface";
interface IAACContextProviderProps {
  children: React.ReactNode;
}
interface IAACContextTypes {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setStateChange: Dispatch<SetStateAction<number>>;
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
  attrMaxId: number | undefined;
  isActionLoading: boolean;
  setIsActionLoading: Dispatch<SetStateAction<boolean>>;
  manageGlobalConditionDeleteCalculate: (
    id: number
  ) => Promise<IManageGlobalConditionLogicExtendTypes[] | undefined>;
  deleteManageGlobalCondition: (id: number) => Promise<void>;
  deleteLogicAndAttributeData: (
    logicId: number,
    attrId: number
  ) => Promise<number | undefined>;

  fetchManageAccessModels: () => Promise<
    IManageAccessModelsTypes[] | [] | undefined
  >;
  manageAccessModels: IManageAccessModelsTypes[] | [];
  selectedAccessModelItem: IManageAccessModelsTypes[];
  setSelectedAccessModelItem: Dispatch<
    SetStateAction<IManageAccessModelsTypes[]>
  >;
  createManageAccessModel: (
    postData: IManageAccessModelsTypes
  ) => Promise<void>;
  deleteManageAccessModel: (items: IManageAccessModelsTypes[]) => Promise<void>;
  fetchManageAccessModelLogics: (
    filterId: number
  ) => Promise<IManageAccessModelLogicExtendTypes[] | undefined>;
  manageAccessModelAttrMaxId: number | undefined;
  manageAccessModelLogicsDeleteCalculate: (
    id: number
  ) => Promise<IManageAccessModelLogicExtendTypes[] | [] | undefined>;
  deleteManageModelLogicAndAttributeData: (
    logicId: number,
    attrId: number
  ) => Promise<number | undefined>;
  searchFilter: (data: IManageAccessModelSearchFilterTypes) => Promise<void>;
  deleteAndSaveState: number;
  setDeleteAndSaveState: Dispatch<SetStateAction<number>>;
  fetchDataSource: () => Promise<void>;
  dataSources: IDataSourceTypes[];
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
  const [globalConditionAttrMaxId, setGlobalConditionAttrMaxId] =
    useState<number>();
  const [manageAccessModelAttrMaxId, setManageAccessModelAttrMaxId] =
    useState<number>();
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [selectedAccessModelItem, setSelectedAccessModelItem] = useState<
    IManageAccessModelsTypes[]
  >([]);
  const [manageAccessModels, setManageAccessModels] = useState<
    IManageAccessModelsTypes[]
  >([]);
  const [deleteAndSaveState, setDeleteAndSaveState] = useState<number>(0);
  const [dataSources, setDataSources] = useState<IDataSourceTypes[]>([]);
  // Fetch Manage Global Conditions
  const fetchManageGlobalConditions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<IManageGlobalConditionTypes[]>(
        `${url}/api/v2/manage-global-conditions`
      );
      if (response) {
        return setManageGlobalConditions(response.data ?? []);
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
        `${url}/api/v2/manage-global-conditions`,
        { manage_global_condition_id, name, description, datasource, status }
      );
      if (res.status === 201) {
        setStateChange((prev) => prev + 1);
        toast({
          title: "Info !!!",
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
          `${url}/api/v2/manage-global-condition-logics`
        ),
        axios.get<IManageGlobalConditionLogicAttributesTypes[]>(
          `${url}/api/v2/manage-global-condition-logic-attributes`
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
      const filteredData = mergedData.filter(
        (item) => item.manage_global_condition_id === filterId
      );
      // return (filteredData as IManageGlobalConditionLogicExtendTypes[]) ?? [];
      if (filteredData) {
        return filteredData as IManageGlobalConditionLogicExtendTypes[];
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const maxId = async () => {
      const [resGlobalCondition, resManageAccessModel] = await Promise.all([
        axios.get(`${url}/api/v2/manage-global-condition-logic-attributes`),
        axios.get(`${url}/api/v2/manage-access-model-logic-attributes`),
      ]);
      const maxIdGlobalCondition = Math.max(
        ...resGlobalCondition.data.map(
          (data: IManageGlobalConditionLogicAttributesTypes) => data.id
        )
      );
      const maxIdManageAccessModel = Math.max(
        ...resManageAccessModel.data.map(
          (data: IManageAccessModelLogicAttributesTypes) => data.id
        )
      );
      if (resGlobalCondition.data.length > 0) {
        setGlobalConditionAttrMaxId(maxIdGlobalCondition);
      } else {
        setGlobalConditionAttrMaxId(0);
      }
      if (resManageAccessModel.data.length > 0) {
        setManageAccessModelAttrMaxId(maxIdManageAccessModel);
      } else {
        setManageAccessModelAttrMaxId(0);
      }
    };
    maxId();
  }, [isActionLoading, stateChange]);
  const manageGlobalConditionDeleteCalculate = async (id: number) => {
    try {
      const result = await fetchManageGlobalConditionLogics(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  // Manage Global Condition Delete
  const deleteManageGlobalCondition = async (id: number) => {
    axios
      .delete(`${url}/api/v2/manage-global-conditions/${id}`)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Info !!!",
            description: `Data deleted successfully.`,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setStateChange((prev) => prev + 1);
      });
  };
  // delete Logic And Attribute Data
  const deleteLogicAndAttributeData = async (
    logicId: number,
    attrId: number
  ) => {
    try {
      const [isExistLogicId, isExistAttrId] = await Promise.all([
        axios.delete(`${url}/api/v2/manage-access-model-logics/${logicId}`),
        axios.delete(
          `${url}/api/v2/manage-access-model-logic-attributes/${attrId}`
        ),
      ]);
      if (isExistLogicId.status === 200 && isExistAttrId.status === 200) {
        return isExistLogicId.status;
      }
    } catch (error: any) {
      return error.response.status;
    }
  };

  // fetch Manage Access Models
  const fetchManageAccessModels = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<IManageAccessModelsTypes[]>(
        `${url}/api/v2/manage-access-models`
      );
      if (response) {
        setManageAccessModels(response.data ?? []);
        return response.data ?? [];
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const createManageAccessModel = async (
    postData: IManageAccessModelsTypes
  ) => {
    try {
      setIsLoading(true);
      const {
        model_name,
        description,
        type,
        state,
        run_status,
        last_run_date,
        created_by,
        last_updated_by,
        last_updated_date,
        revision,
        revision_date,
      } = postData;
      const res = await axios.post(`${url}/api/v2/manage-access-models`, {
        model_name,
        description,
        type,
        state,
        run_status,
        last_run_date,
        created_by,
        last_updated_by,
        last_updated_date,
        revision,
        revision_date,
      });
      if (res.status === 201) {
        setStateChange((prev) => prev + 1);
        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteManageAccessModel = async (items: IManageAccessModelsTypes[]) => {
    for (const item of items) {
      const { manage_access_model_id: id } = item;
      axios
        .delete(`${url}/api/v2/manage-access-models/${id}`)
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Info !!!",
              description: `Data deleted successfully.`,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setStateChange((prev) => prev + 1);
        });
    }
  };
  const fetchManageAccessModelLogics = async (filterId: number) => {
    try {
      setIsLoading(true);
      const [logicsRes, attributesRes] = await Promise.all([
        axios.get<IManageAccessModelLogicsTypes[]>(
          `${url}/api/v2/manage-access-model-logics`
        ),
        axios.get<IManageAccessModelLogicAttributesTypes[]>(
          `${url}/api/v2/manage-access-model-logic-attributes`
        ),
      ]);
      const attributesMap = new Map(
        attributesRes.data.map((attr) => [
          attr.manage_access_model_logic_id,
          attr,
        ])
      );
      const mergedData = logicsRes.data.map((item) => ({
        ...item,
        ...(attributesMap.get(item.manage_access_model_logic_id) || {}),
      }));
      const filteredData = mergedData.filter(
        (item) => item.manage_access_model_id === filterId
      );
      // return (filteredData as IManageGlobalConditionLogicExtendTypes[]) ?? [];
      if (filteredData) {
        return filteredData as IManageAccessModelLogicExtendTypes[];
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const manageAccessModelLogicsDeleteCalculate = async (id: number) => {
    try {
      const result = await fetchManageAccessModelLogics(id);
      return result ?? [];
    } catch (error) {
      console.log(error);
    }
  };
  const deleteManageModelLogicAndAttributeData = async (
    logicId: number,
    attrId: number
  ) => {
    try {
      const [isExistLogicId, isExistAttrId] = await Promise.all([
        axios.delete(`${url}/api/v2/manage-access-model-logics/${logicId}`),
        axios.delete(
          `${url}/api/v2/manage-access-model-logic-attributes/${attrId}`
        ),
      ]);
      if (isExistLogicId.status === 200 && isExistAttrId.status === 200) {
        return isExistLogicId.status;
      }
    } catch (error: any) {
      return error.response.status;
    }
  };
  const searchFilter = async (data: IManageAccessModelSearchFilterTypes) => {
    const allAccessModel = await fetchManageAccessModels();

    const filterResult = allAccessModel?.filter((item) => {
      setIsLoading(true);
      // Check if each filter condition is satisfied
      const matchesModelName =
        data.model_name.length === 0 ||
        item.model_name.toLowerCase().includes(data.model_name.toLowerCase());
      const matchesCreatedBy =
        data.created_by.length === 0 ||
        item.created_by.toLowerCase().includes(data.created_by.toLowerCase());
      const matchesState =
        data.state.length === 0 ||
        item.state.toLowerCase().includes(data.state.toLowerCase());
      const matchesDate =
        data.last_run_date.length === 0 ||
        item.last_run_date.includes(data.last_run_date);
      // console.log(matchesModelName);
      // console.log(matchesDate);
      setIsLoading(false);
      // Return true only if all conditions are met
      return (
        matchesModelName && matchesCreatedBy && matchesState && matchesDate
      );
    });

    setManageAccessModels(filterResult ?? []);
    // return filterResult ?? [];
  };
  const fetchDataSource = async () => {
    await axios
      .get<IDataSourceTypes[]>(`${url}/api/v2/data-sources`)
      .then((res) => {
        if (res.status === 200) {
          setDataSources(res.data);
        }
      });
  };
  const value = {
    isLoading,
    setIsLoading,
    setStateChange,
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
    attrMaxId: globalConditionAttrMaxId,
    isActionLoading,
    setIsActionLoading,
    manageGlobalConditionDeleteCalculate,
    deleteManageGlobalCondition,
    deleteLogicAndAttributeData,
    manageAccessModels,
    fetchManageAccessModels,
    selectedAccessModelItem,
    setSelectedAccessModelItem,
    createManageAccessModel,
    deleteManageAccessModel,
    fetchManageAccessModelLogics,
    manageAccessModelAttrMaxId,
    manageAccessModelLogicsDeleteCalculate,
    deleteManageModelLogicAndAttributeData,
    searchFilter,
    deleteAndSaveState,
    setDeleteAndSaveState,
    fetchDataSource,
    dataSources,
  };
  return (
    <AACContext.Provider value={value}>
      <ControlsContextProvider>{children}</ControlsContextProvider>
    </AACContext.Provider>
  );
};
