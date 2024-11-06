import { IControlsTypes } from "@/types/interfaces/manageControls.interface";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAACContext } from "./AdvanceAccessControlsContext";
import { toast } from "@/components/ui/use-toast";
interface IControlsProviderProps {
  children: React.ReactNode;
}
interface IControlsContextTypes {
  selectedControl: IControlsTypes[];
  setSelectedControl: React.Dispatch<React.SetStateAction<IControlsTypes[]>>;
  fetchControls: () => Promise<IControlsTypes[] | undefined>;
  controlsData: IControlsTypes[];
  searchFilter: (data: ISearchTypes) => void;
  createControl: (data: IControlsTypes) => void;
}
interface ISearchTypes {
  match: string;
  control_name: string;
  control_type: string;
  priority: string;
  datasources: string;
}
const ControlsContext = createContext<IControlsContextTypes | null>(null);
export const useControlsContext = () => {
  const consumer = useContext(ControlsContext);
  if (!consumer) {
    throw new Error("error");
  }
  return consumer;
};
export const ControlsContextProvider = ({
  children,
}: IControlsProviderProps) => {
  const url = import.meta.env.VITE_API_URL;
  const { setIsLoading } = useAACContext();
  const [controlsData, setControlsData] = useState<IControlsTypes[]>([]);
  const [selectedControl, setSelectedControl] = useState<IControlsTypes[]>([]);
  // fetch controls
  const fetchControls = async () => {
    try {
      // setIsLoading(true);
      const response = await axios.get<IControlsTypes[]>(
        `${url}/api/v2/controls`
      );
      if (response) {
        setControlsData(response.data ?? []);
        return response.data ?? [];
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createControl = async (data: IControlsTypes) => {
    await axios
      .post(`${url}/api/v2/controls`, data)
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: "Info !!!",
            description: `Added successfully.`,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchFilter = async (data: ISearchTypes) => {
    const allControls = await fetchControls();

    const filterResult = allControls?.filter((item) => {
      setIsLoading(true);
      // Check if each filter condition is satisfied
      const matchesControlName =
        data.control_name.length === 0 ||
        item.control_name
          .toLowerCase()
          .includes(data.control_name.toLowerCase());
      const matchesControlType =
        data.control_type.length === 0 ||
        item.control_type
          .toLowerCase()
          .includes(data.control_type.toLowerCase());
      const matchesPriority =
        data.priority.length === 0 ||
        String(item.priority).includes(data.priority);
      const matchesDatasources =
        data.datasources.length === 0 ||
        item.datasources.toLowerCase().includes(data.datasources.toLowerCase());
      // console.log(matchesModelName);
      // console.log(matchesDate);
      setIsLoading(false);
      // Return true only if all conditions are met
      return (
        matchesControlName &&
        matchesControlType &&
        matchesPriority &&
        matchesDatasources
      );
    });
    setControlsData(filterResult ?? []);
    // return filterResult ?? [];
  };

  const value = {
    selectedControl,
    setSelectedControl,
    fetchControls,
    controlsData,
    searchFilter,
    createControl,
  };
  return (
    <ControlsContext.Provider value={value}>
      {children}
    </ControlsContext.Provider>
  );
};
