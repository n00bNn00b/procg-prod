import { toast } from "@/components/ui/use-toast";
import {
  ICreateAccessPointsElementTypes,
  IFetchAccessPointsElementTypes,
  IFetchAccessPointsEntitlementElementsTypes,
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
  createAccessEntitlementElements: (entitlement_id: number) => Promise<void>;
  deleteAccessEntitlementElement: (
    entitlementId: number,
    accessPointId: number
  ) => Promise<void>;
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
  const [save2, setSave2] = useState<number>(0);
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
  console.log(selected, "selected");
  // Fetch Access Points Entitlement
  const fetchAccessPointsEntitlement = async (
    fetchData: IManageAccessEntitlementsTypes
  ) => {
    setIsLoading(true);
    try {
      if (fetchData) {
        const response = await axios.get<
          IFetchAccessPointsEntitlementElementsTypes[]
        >(`${url}/access-entitlement-elements/${fetchData.entitlement_id}`);
        const accessPointsId = response.data.map(
          (data) => data.access_point_id
        );
        console.log(accessPointsId, "accessPointsId");

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
          setFilteredData(sortingData);
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
      setIsLoading(true);
      const res = await axios.post<ICreateAccessPointsElementTypes>(
        `${url}/access-points-element`,
        {
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
  //create access entitlement elements
  const createAccessEntitlementElements = async (entitlement_id: number) => {
    //get max access point id
    const res = await axios.get(`${url}/access-points-element`);
    const accessPointsMaxId =
      res.data.length > 0
        ? Math.max(
            ...res.data.map(
              (data: IFetchAccessPointsElementTypes) => data.access_point_id
            )
          )
        : 1;
    console.log(
      entitlement_id,
      accessPointsMaxId,
      "entitlement_id,accessPointsMaxId"
    );
    //post data
    await axios
      .post<IFetchAccessPointsEntitlementElementsTypes>(
        `${url}/access-entitlement-elements`,
        {
          entitlement_id: entitlement_id,
          access_point_id: accessPointsMaxId,
        }
      )
      .catch((error) => {
        console.log(error);
      });
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
      await axios.delete(`${url}/access-points-element/${accessPointId}`),
    ]);
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
  };

  return (
    <ManageAccessEntitlements.Provider value={value}>
      {children}
    </ManageAccessEntitlements.Provider>
  );
};
