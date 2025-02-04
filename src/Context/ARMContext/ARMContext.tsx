import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  IARMAsynchronousTasksParametersTypes,
  IARMAsynchronousTasksTypes,
  IARMTaskParametersTypes,
  IARMViewRequestsTypes,
  IAsynchronousRequestsAndTaskSchedulesTypes,
} from "@/types/interfaces/ARM.interface";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
interface ARMContextProviderProps {
  children: ReactNode;
}

interface ARMContext {
  getAsyncTasks: () => Promise<IARMAsynchronousTasksTypes[] | undefined>;
  getAsyncTasksLazyLoading: (
    page: number,
    limit: number
  ) => Promise<IARMAsynchronousTasksTypes[] | undefined>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAsyncTasks: (
    selectedItems: IARMAsynchronousTasksTypes[]
  ) => Promise<void>;
  selectedTask: IARMAsynchronousTasksTypes | undefined;
  setSelectedTask: React.Dispatch<
    React.SetStateAction<IARMAsynchronousTasksTypes | undefined>
  >;
  selectedTaskParameters: IARMTaskParametersTypes[] | undefined;
  setSelectedTaskParameters: React.Dispatch<
    React.SetStateAction<IARMTaskParametersTypes[] | undefined>
  >;
  getTaskParameters: (
    user_task_name: string,
    task_name: string,
    page: number,
    limit: number
  ) => Promise<IARMTaskParametersTypes[] | undefined>;
  getTaskParametersByTaskName: (
    task_name: string
  ) => Promise<IARMAsynchronousTasksParametersTypes[] | undefined>;
  isSubmit: number;
  setIsSubmit: React.Dispatch<React.SetStateAction<number>>;
  getAsynchronousRequestsAndTaskSchedules: (
    page: number,
    limit: number
  ) => Promise<IAsynchronousRequestsAndTaskSchedulesTypes[] | undefined>;
  deleteAsynchronousRequestsAndTaskSchedules: (
    selectedItems: IAsynchronousRequestsAndTaskSchedulesTypes[]
  ) => Promise<void>;
  getViewRequests: (
    page: number,
    limit: number
  ) => Promise<IARMViewRequestsTypes[] | undefined>;
}

// eslint-disable-next-line react-refresh/only-export-components

const ARMContext = createContext({} as ARMContext);

// eslint-disable-next-line react-refresh/only-export-components
export function useARMContext() {
  return useContext(ARMContext);
}

export function ARMContextProvider({ children }: ARMContextProviderProps) {
  const api = useAxiosPrivate();
  const { setTotalPage } = useGlobalContext();
  const [isSubmit, setIsSubmit] = useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState<
    IARMAsynchronousTasksTypes | undefined
  >(undefined);
  const [selectedTaskParameters, setSelectedTaskParameters] = useState<
    IARMTaskParametersTypes[] | undefined
  >(undefined);
  // const [page, setPage] = useState<number>(1);
  // const [totalPage, setTotalPage] = useState<number>(1);

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
  const getAsyncTasksLazyLoading = async (page: number, limit: number) => {
    try {
      //111
      setIsLoading(true);
      const [countTasks, tasks] = await Promise.all([
        api.get<IARMAsynchronousTasksTypes[]>(`/arm-tasks/show-tasks`),
        api.get<IARMAsynchronousTasksTypes[]>(
          `/arm-tasks/show-tasks/${page}/${limit}`
        ),
      ]);
      const totalCount = countTasks.data.length;
      const totalPages = Math.ceil(totalCount / limit);
      setTotalPage(totalPages);
      return tasks.data ?? [];
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

  const getTaskParameters = async (
    user_task_name: string,
    task_name: string,
    page: number,
    limit: number
  ) => {
    try {
      const [countTasksParameters, tasksParameters] = await Promise.all([
        api.get<IARMTaskParametersTypes[]>(`/arm-tasks/${user_task_name}`),
        api.get<IARMTaskParametersTypes[]>(
          `/arm-tasks/${task_name}/${page}/${limit}`
        ),
      ]);

      const totalCount = countTasksParameters.data.length;
      const totalPages = Math.ceil(totalCount / limit);
      setTotalPage(totalPages);
      return tasksParameters.data ?? [];
    } catch (error) {
      console.log("Task Parameters Item Not found");
      return [];
    }
  };

  const getTaskParametersByTaskName = async (user_task_name: string) => {
    try {
      const res = await api.get<IARMAsynchronousTasksParametersTypes[]>(
        `/arm-tasks/${user_task_name}`
      );

      return res.data ?? [];
    } catch (error) {
      console.log("Task Parameters Item Not found");
      return [];
    }
  };
  const getAsynchronousRequestsAndTaskSchedules = async (
    page: number,
    limit: number
  ) => {
    try {
      const [allTasksSchedules, taskSchedules] = await Promise.all([
        api.get<IAsynchronousRequestsAndTaskSchedulesTypes[]>(
          `/asynchronous-requests-and-task-schedules`
        ),
        api.get<IAsynchronousRequestsAndTaskSchedulesTypes[]>(
          `/asynchronous-requests-and-task-schedules/${page}/${limit}`
        ),
      ]);
      const totalCount = allTasksSchedules.data.length;
      const totalPages = Math.ceil(totalCount / limit);
      setTotalPage(totalPages);
      return taskSchedules.data ?? [];
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
  const getViewRequests = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const [ViewRequest, resultLazyLoading] = await Promise.all([
        api.get<IARMViewRequestsTypes[]>(
          `/asynchronous-requests-and-task-schedules/view-requests`
        ),
        api.get<IARMViewRequestsTypes[]>(
          `/asynchronous-requests-and-task-schedules/view-requests/${page}/${limit}`
        ),
      ]);
      const totalCount = ViewRequest.data.length;
      const totalPages = Math.ceil(totalCount / limit);
      setTotalPage(totalPages);
      return resultLazyLoading.data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const values = {
    getAsyncTasks,
    getAsyncTasksLazyLoading,
    isLoading,
    setIsLoading,
    deleteAsyncTasks,
    selectedTask,
    setSelectedTask,
    selectedTaskParameters,
    setSelectedTaskParameters,
    getTaskParameters,
    getTaskParametersByTaskName,
    isSubmit,
    setIsSubmit,
    getAsynchronousRequestsAndTaskSchedules,
    deleteAsynchronousRequestsAndTaskSchedules,
    getViewRequests,
  };
  return <ARMContext.Provider value={values}>{children}</ARMContext.Provider>;
}
