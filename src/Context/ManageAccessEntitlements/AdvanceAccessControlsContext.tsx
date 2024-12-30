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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
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
  const { token } = useGlobalContext();
  const api = useAxiosPrivate();
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
      const response = await api.get<IManageGlobalConditionTypes[]>(
        `/manage-global-conditions`
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
      const res = await api.post<IManageGlobalConditionTypes>(
        `/manage-global-conditions`,
        { manage_global_condition_id, name, description, datasource, status }
      );
      if (res.status === 201) {
        setStateChange((prev) => prev + 1);
        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
      }
    } catch (error) {
      console.log(error);
      // if (error.response.status === 408) {
      //   toast({
      //     title: "Info",
      //     description: `${error.response.data.message}`,
      //   });
      // }
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch Manage Global Conditions
  const fetchManageGlobalConditionLogics = async (filterId: number) => {
    try {
      setIsLoading(true);
      const [logicsRes, attributesRes] = await Promise.all([
        api.get<IManageGlobalConditionLogicTypes[]>(
          `/manage-global-condition-logics`
        ),
        api.get<IManageGlobalConditionLogicAttributesTypes[]>(
          `/manage-global-condition-logic-attributes`
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
      if (token?.user_id === 0) return;
      const [resGlobalCondition, resManageAccessModel] = await Promise.all([
        api.get(`/manage-global-condition-logic-attributes`),
        api.get(`/manage-access-model-logic-attributes`),
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

  // Manage Global Condition Delete
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
    api
      .delete(`/manage-global-conditions/${id}`)
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
        api.delete(`/manage-access-model-logics/${logicId}`),
        api.delete(`/manage-access-model-logic-attributes/${attrId}`),
      ]);
      if (isExistLogicId.status === 200 && isExistAttrId.status === 200) {
        return isExistLogicId.status;
      }
    } catch (error) {
      console.log(error);
      // return error.response.status;
    }
  };

  // fetch Manage Access Models
  const fetchManageAccessModels = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<IManageAccessModelsTypes[]>(
        `/manage-access-models`
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

  // Create Manage Access Model
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
      const res = await api.post(`/manage-access-models`, {
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

  // delete Manage Access Model
  const deleteManageAccessModel = async (items: IManageAccessModelsTypes[]) => {
    for (const item of items) {
      const { manage_access_model_id: id } = item;
      api
        .delete(`/manage-access-models/${id}`)
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

  // fetch Manage Access Model Logics
  const fetchManageAccessModelLogics = async (filterId: number) => {
    try {
      setIsLoading(true);
      const [logicsRes, attributesRes] = await Promise.all([
        api.get<IManageAccessModelLogicsTypes[]>(`/manage-access-model-logics`),
        api.get<IManageAccessModelLogicAttributesTypes[]>(
          `/manage-access-model-logic-attributes`
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

  // Manage Access Model Delete
  const manageAccessModelLogicsDeleteCalculate = async (id: number) => {
    try {
      const result = await fetchManageAccessModelLogics(id);
      return result ?? [];
    } catch (error) {
      console.log(error);
    }
  };

  // delete Manage Access Model Logic And Attribute Data
  const deleteManageModelLogicAndAttributeData = async (
    logicId: number,
    attrId: number
  ) => {
    try {
      const [isExistLogicId, isExistAttrId] = await Promise.all([
        api.delete(`/manage-access-model-logics/${logicId}`),
        api.delete(`/manage-access-model-logic-attributes/${attrId}`),
      ]);
      if (isExistLogicId.status === 200 && isExistAttrId.status === 200) {
        return isExistLogicId.status;
      }
    } catch (error) {
      console.log(error);
      // return error.response.status;
    }
  };

  // Search Filter
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

  // Fetch Data Source
  const fetchDataSource = async () => {
    await api.get<IDataSourceTypes[]>(`/data-sources`).then((res) => {
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
