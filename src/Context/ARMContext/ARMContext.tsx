import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  IARMAsynchronousTasksParametersTypes,
  IARMAsynchronousTasksTypes,
  IARMTaskParametersTypes,
  IARMViewRequestsTypes,
  IAsynchronousRequestsAndTaskSchedulesTypes,
  IAsynchronousRequestsAndTaskSchedulesTypesV1,
  IExecutionMethodsTypes,
} from "@/types/interfaces/ARM.interface";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { toast } from "@/components/ui/use-toast";
interface ARMContextProviderProps {
  children: ReactNode;
}

interface ARMContext {
  totalPage: number;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
  totalPage2: number;
  setTotalPage2: React.Dispatch<React.SetStateAction<number>>;
  getAsyncTasks: () => Promise<IARMAsynchronousTasksTypes[] | undefined>;
  getAsyncTasksLazyLoading: (
    page: number,
    limit: number
  ) => Promise<IARMAsynchronousTasksTypes[] | undefined>;
  getManageExecutionMethods: () => Promise<
    IExecutionMethodsTypes[] | undefined
  >;
  getManageExecutionMethodsLazyLoading: (
    page: number,
    limit: number
  ) => Promise<IExecutionMethodsTypes[] | undefined>;

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
  getTaskParametersLazyLoading: (
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
  getAsynchronousRequestsAndTaskSchedulesV1: (
    page: number,
    limit: number
  ) => Promise<IAsynchronousRequestsAndTaskSchedulesTypesV1[] | undefined>;
  deleteAsynchronousRequestsAndTaskSchedules: (
    selectedItems: IAsynchronousRequestsAndTaskSchedulesTypes[]
  ) => Promise<void>;
  deleteAsynchronousRequestsAndTaskSchedulesV1: (
    selectedItems: IAsynchronousRequestsAndTaskSchedulesTypesV1[]
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
  const [isSubmit, setIsSubmit] = useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState<
    IARMAsynchronousTasksTypes | undefined
  >(undefined);
  const [selectedTaskParameters, setSelectedTaskParameters] = useState<
    IARMTaskParametersTypes[] | undefined
  >(undefined);
  // const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalPage2, setTotalPage2] = useState<number>(1);

  const getAsyncTasks = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<IARMAsynchronousTasksTypes[]>(
        `/arm-tasks/show-tasks`
      );
      const filterdData = res.data.filter((item) => item.srs === "Y");
      return filterdData ?? [];
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getManageExecutionMethods = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<IExecutionMethodsTypes[]>(
        `/arm-tasks/show-execution-methods`
      );
      return res.data ?? [];
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getManageExecutionMethodsLazyLoading = async (
    page: number,
    limit: number
  ) => {
    try {
      setIsLoading(true);
      const [countExecutionMethods, ExecutionMethods] = await Promise.all([
        api.get<IExecutionMethodsTypes[]>(`/arm-tasks/show-execution-methods`),
        api.get<IExecutionMethodsTypes[]>(
          `/arm-tasks/show-execution-methods/${page}/${limit}`
        ),
      ]);

      const totalCount = countExecutionMethods.data.length;
      const totalPages = Math.ceil(totalCount / limit);
      setTotalPage(totalPages);
      return ExecutionMethods.data ?? [];
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
      console.log(countTasks, "IARMAsynchronousTasksTypes");
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

  const getTaskParametersLazyLoading = async (
    task_name: string,
    page: number,
    limit: number
  ) => {
    try {
      const [countTasksParameters, tasksParameters] = await Promise.all([
        api.get<IARMTaskParametersTypes[]>(
          `/arm-tasks/task-params/${task_name}`
        ),
        api.get<IARMTaskParametersTypes[]>(
          `/arm-tasks/task-params/${task_name}/${page}/${limit}`
        ),
      ]);

      const totalCount = countTasksParameters.data.length;
      const totalPages = Math.ceil(totalCount / limit);
      setTotalPage2(totalPages);
      return tasksParameters.data ?? [];
    } catch (error) {
      console.log("Task Parameters Item Not found");
      return [];
    }
  };

  const getTaskParametersByTaskName = async (task_name: string) => {
    try {
      const res = await api.get<IARMAsynchronousTasksParametersTypes[]>(
        `/arm-tasks/task-params/${task_name}`
      );
      console.log(res, "res");
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
  // V1 API
  const getAsynchronousRequestsAndTaskSchedulesV1 = async (
    page: number,
    limit: number
  ) => {
    try {
      const [allTasksSchedules, taskSchedules] = await Promise.all([
        api.get<IAsynchronousRequestsAndTaskSchedulesTypesV1[]>(
          `/api/v1/asynchronous-requests-and-task-schedules/task-schedules`
        ),
        api.get<IAsynchronousRequestsAndTaskSchedulesTypesV1[]>(
          `/api/v1/asynchronous-requests-and-task-schedules/task-schedules/${page}/${limit}`
        ),
      ]);
      console.log(allTasksSchedules, "allTasksSchedules");
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
  const deleteAsynchronousRequestsAndTaskSchedulesV1 = async (
    selectedItems: IAsynchronousRequestsAndTaskSchedulesTypesV1[]
  ) => {
    try {
      setIsLoading(true);
      const responses = await Promise.all(
        selectedItems.map(async (item) => {
          try {
            console.log("Making request for:", item.task_name); // Log item details
            const response = await api.put(
              `/api/v1/asynchronous-requests-and-task-schedules/cancel-task-schedule-v1/${item.task_name}`,
              {
                redbeat_schedule_name: item.redbeat_schedule_name,
              }
            );
            return response; // Ensure you are returning the actual response
          } catch (error) {
            console.error("Error canceling task schedule:", error);
            return null; // Return null or handle the error as needed
          }
        })
      );
      responses.map((i) => {
        return toast({
          title: "Info !!!",
          description: `${i?.data?.message}`,
        });
      });
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
    totalPage,
    setTotalPage,
    totalPage2,
    setTotalPage2,
    getManageExecutionMethods,
    getManageExecutionMethodsLazyLoading,
    getAsyncTasks,
    getAsyncTasksLazyLoading,
    isLoading,
    setIsLoading,
    deleteAsyncTasks,
    selectedTask,
    setSelectedTask,
    selectedTaskParameters,
    setSelectedTaskParameters,
    getTaskParametersLazyLoading,
    getTaskParametersByTaskName,
    isSubmit,
    setIsSubmit,
    getAsynchronousRequestsAndTaskSchedules,
    getAsynchronousRequestsAndTaskSchedulesV1,
    deleteAsynchronousRequestsAndTaskSchedules,
    deleteAsynchronousRequestsAndTaskSchedulesV1,
    getViewRequests,
  };
  return <ARMContext.Provider value={values}>{children}</ARMContext.Provider>;
}
