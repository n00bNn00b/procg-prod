import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  IARMAsynchronousTasksTypes,
  IARMTaskParametersTypes,
  IAsynchronousRequestsAndTaskSchedulesTypes,
} from "@/types/interfaces/ARM.interface";
import React, { ReactNode, createContext, useContext, useState } from "react";
interface ARMContextProviderProps {
  children: ReactNode;
}

interface ARMContext {
  getAsyncTasks: () => Promise<IARMAsynchronousTasksTypes[] | undefined>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAsyncTasks: (
    selectedItems: IARMAsynchronousTasksTypes[]
  ) => Promise<void>;
  selectedTask: string;
  setSelectedTask: React.Dispatch<React.SetStateAction<string>>;
  selectedTaskParameters: IARMTaskParametersTypes[] | undefined;
  setSelectedTaskParameters: React.Dispatch<
    React.SetStateAction<IARMTaskParametersTypes[] | undefined>
  >;
  getTaskParameters: (
    task_name: string
  ) => Promise<IARMTaskParametersTypes[] | undefined>;
  isSubmit: number;
  setIsSubmit: React.Dispatch<React.SetStateAction<number>>;
  getAsynchronousRequestsAndTaskSchedules: () => Promise<
    IAsynchronousRequestsAndTaskSchedulesTypes[] | undefined
  >;
  deleteAsynchronousRequestsAndTaskSchedules: (
    selectedItems: IAsynchronousRequestsAndTaskSchedulesTypes[]
  ) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components

const ARMContext = createContext({} as ARMContext);

// eslint-disable-next-line react-refresh/only-export-components
export function useARMContext() {
  return useContext(ARMContext);
}

export function ARMContextProvider({ children }: ARMContextProviderProps) {
  const api = useAxiosPrivate();
  const [isSubmit, setIsSubmit] = useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedTaskParameters, setSelectedTaskParameters] = useState<
    IARMTaskParametersTypes[] | undefined
  >(undefined);
  const getAsyncTasks = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<IARMAsynchronousTasksTypes[]>(
        `/arm-tasks/show-tasks`
      );
      return res.data ?? [];
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteAsyncTasks = async (
    selectedItems: IARMAsynchronousTasksTypes[]
  ) => {
    try {
      setIsLoading(true);
      await Promise.all(
        selectedItems.map(async (item) => {
          await api.put(`/arm-tasks/cancel-task/${item.task_name}`);
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskParameters = async (task_name: string) => {
    try {
      const res = await api.get<IARMTaskParametersTypes[]>(
        `/arm-task-parameters/${task_name}`
      );
      return res.data ?? [];
    } catch (error) {
      console.log("Task Parameters Item Not found");
      return [];
    }
  };
  const getAsynchronousRequestsAndTaskSchedules = async () => {
    try {
      const res = await api.get<IAsynchronousRequestsAndTaskSchedulesTypes[]>(
        `/asynchronous-requests-and-task-schedules`
      );
      return res.data ?? [];
    } catch (error) {
      console.log("Task Parameters Item Not found");
      return [];
    }
  };
  const deleteAsynchronousRequestsAndTaskSchedules = async (
    selectedItems: IAsynchronousRequestsAndTaskSchedulesTypes[]
  ) => {
    try {
      setIsLoading(true);
      await Promise.all(
        selectedItems.map(async (item) => {
          await api.put(
            `/asynchronous-requests-and-task-schedules/cancel-task-schedule/${item.task_name}/${item.redbeat_schedule_name}`
          );
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const values = {
    getAsyncTasks,
    isLoading,
    setIsLoading,
    deleteAsyncTasks,
    selectedTask,
    setSelectedTask,
    selectedTaskParameters,
    setSelectedTaskParameters,
    getTaskParameters,
    isSubmit,
    setIsSubmit,
    getAsynchronousRequestsAndTaskSchedules,
    deleteAsynchronousRequestsAndTaskSchedules,
  };
  return <ARMContext.Provider value={values}>{children}</ARMContext.Provider>;
}
