import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useARMContext } from "@/Context/ARMContext/ARMContext";
import {
  IARMAsynchronousTasksTypes,
  IAsynchronousRequestsAndTaskSchedulesTypesV1,
  IScheduleOnce,
  ISchedulePropsNonPeriodic,
  ISchedulePropsPeriodic,
} from "@/types/interfaces/ARM.interface";
import { X } from "lucide-react";
import Schedule from "./Schedule";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import CustomModal4 from "@/components/CustomModal/CustomModal4";

interface ITaskRequestProps {
  action: string;
  handleCloseModal: () => void;
  user_schedule_name: string;
  selected?: IAsynchronousRequestsAndTaskSchedulesTypesV1;
}

const TaskRequestV1: FC<ITaskRequestProps> = ({
  action,
  handleCloseModal,
  user_schedule_name,
  selected,
}) => {
  const api = useAxiosPrivate();
  const { getAsyncTasks, getTaskParametersByTaskName, setIsSubmit } =
    useARMContext();
  const { isOpenScheduleModalV1, setIsOpenScheduleModalV1 } =
    useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [asyncTaskNames, setAsyncTaskNames] = useState<
    IARMAsynchronousTasksTypes[] | undefined
  >(undefined);
  const [parameters, setParameters] = useState<Record<string, string | number>>(
    selected?.kwargs || {}
  );
  const [periodic, setPeriodic] = useState<
    ISchedulePropsPeriodic | undefined
  >();
  const [scheduleType, setScheduleType] = useState<string>(
    selected?.schedule_type ?? "PERIODIC"
  );
  const [schedule, setSchedule] = useState<
    | ISchedulePropsPeriodic
    | ISchedulePropsNonPeriodic
    | IScheduleOnce
    | undefined
  >(selected?.schedule);

  useEffect(() => {
    const fetchAsyncTasks = async () => {
      try {
        setIsLoading(true);
        const tasks = await getAsyncTasks();
        setAsyncTaskNames(tasks);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAsyncTasks();
  }, []);

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      parameters: parameters,
      // kwargs: action === "Edit Task Schedule" ? selected?.kwargs : parameters,
    });
  }, [parameters]);

  const handleGetParameters = async (task_name: string) => {
    try {
      setIsLoading(true);
      const results = await getTaskParametersByTaskName(task_name);
      const updatedParameters: Record<string, string | number> = {};

      if (results) {
        results.forEach((item) => {
          updatedParameters[item.parameter_name] =
            item.data_type.toLowerCase() === "integer" ? 0 : "";
          // updatedParameters["data_type"] =
          //   item.data_type.toLowerCase() === "integer" ? "integer" : "string";
        });
      }
      setParameters(updatedParameters);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const FormSchema = z.object({
    user_schedule_name: z.string(),
    task_name: z.string(),
    parameters: z.record(z.union([z.string(), z.number()])),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_schedule_name: "",
      task_name: "",
      parameters: selected?.kwargs ?? {},
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!(await form.trigger())) return;

    if (action !== "Edit Task Schedule") {
      if (
        data.user_schedule_name === "" ||
        data.task_name === "" ||
        scheduleType === "" ||
        !schedule
      )
        return toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
    }
    const payload =
      action === "Schedule A Task"
        ? {
            user_schedule_name: data.user_schedule_name,
            task_name: data.task_name,
            parameters: data.parameters,
            schedule,
            schedule_type: scheduleType,
          }
        : {
            schedule,
            schedule_type: scheduleType,
            parameters: data.parameters,
            redbeat_schedule_name: selected?.redbeat_schedule_name,
          };
    console.log(payload, "payload");
    try {
      setIsLoading(true);
      const res = await (action === "Schedule A Task"
        ? api.post(
            "/api/v1/asynchronous-requests-and-task-schedules/create-task-schedule-v1",
            payload
          )
        : api.put(
            `/asynchronous-requests-and-task-schedules/update-task-schedule-v1/${selected?.task_name}`,
            payload
          ));
      if (res) toast({ title: "Success", description: `${res.data.message}` });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request.",
        variant: "destructive",
      });
    } finally {
      form.reset();
      setSchedule(undefined);
      setScheduleType("PERIODIC");
      setIsLoading(false);
      setIsSubmit(Math.random() + 23 * 3000);
    }
  };

  return (
    <div
      className={`${
        action === "Edit Task Schedule"
          ? ""
          : "w-[900px] h-[532px] mx-auto my-10 border rounded"
      } `}
    >
      {action === "Edit Task Schedule" && (
        <div className="p-2 bg-slate-300 rounded-t mx-auto text-center font-bold flex justify-between">
          <h2>Edit Task Schedule</h2>
          <X onClick={() => handleCloseModal()} className="cursor-pointer" />
        </div>
      )}
      {isOpenScheduleModalV1 === "Schedule" && (
        <CustomModal4 w="w-[770px]" h="h-[450px]">
          <Schedule
            schedule={selected?.schedule ?? schedule}
            setSchedule={setSchedule}
            scheduleType={scheduleType}
            setScheduleType={setScheduleType}
            action="Schedule"
            setIsOpenScheduleModalV1={setIsOpenScheduleModalV1}
            selected={selected}
            periodic={periodic}
            setPeriodic={setPeriodic}
          />
        </CustomModal4>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-4">
          <div className="grid grid-cols-2 gap-4">
            {user_schedule_name !== "ad_hoc" &&
              action === "Schedule A Task" && (
                <FormField
                  control={form.control}
                  name="user_schedule_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Schedule Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          disabled={user_schedule_name === "ad_hoc"}
                          placeholder="User Schedule Name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
          </div>
          <div className="grid grid-cols-2 gap-4 pb-2">
            {action !== "Edit Task Schedule" && (
              <FormField
                control={form.control}
                name="task_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Task Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleGetParameters(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Task" />
                        </SelectTrigger>
                        <SelectContent>
                          {asyncTaskNames?.map((item) => (
                            <SelectItem
                              key={item.arm_task_id}
                              value={item.task_name}
                            >
                              {item.user_task_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {user_schedule_name !== "Ad Hoc" && (
              <div className="flex flex-col gap-[18px] pt-8">
                <h3
                  className="bg-gray-400 rounded p-[7px] border text-white font-bold hover:bg-gray-500 text-center cursor-pointer"
                  onClick={() => setIsOpenScheduleModalV1("Schedule")}
                >
                  Schedule
                </h3>
              </div>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-winter-100  hover:bg-winter-100">
                <TableHead className="border border-winter-400">
                  Parameter Name
                </TableHead>
                <TableHead className="border border-winter-400">
                  Parameter Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center h-30 border border-winter-400"
                  >
                    <l-tailspin
                      size="40"
                      stroke="5"
                      speed="0.9"
                      color="black"
                    ></l-tailspin>
                  </TableCell>
                </TableRow>
              ) : Object.entries(form.watch("parameters") || {}).length ===
                0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center h-32 border border-winter-400"
                  >
                    No parameters available. Please select a task.
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(form.watch("parameters") || {}).map(
                  ([key, value]) => (
                    <TableRow key={key}>
                      {!key.trim() ? (
                        <TableCell className="border border-winter-400">
                          Select a Task
                        </TableCell>
                      ) : (
                        <>
                          <TableCell className="border border-winter-100 p-2">
                            {key}
                          </TableCell>
                          <TableCell className="border border-winter-100 p-2">
                            <Input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                form.setValue(
                                  `parameters.${key}`,
                                  typeof value === "number"
                                    ? Number(e.target.value)
                                    : e.target.value
                                )
                              }
                              className="h-8"
                            />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <Button type="submit" className="mt-5">
              {isLoading ? <div>Loading...</div> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskRequestV1;
