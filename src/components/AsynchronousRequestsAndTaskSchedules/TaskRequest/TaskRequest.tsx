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
  IAsynchronousRequestsAndTaskSchedulesTypes,
} from "@/types/interfaces/ARM.interface";
import { X } from "lucide-react";

interface ITaskRequestTypes {
  action: string;
  handleCloseModal: () => void;
  user_schedule_name: string;
  selected?: IAsynchronousRequestsAndTaskSchedulesTypes;
}

const TaskRequest: FC<ITaskRequestTypes> = ({
  action,
  handleCloseModal,
  user_schedule_name,
  selected,
}) => {
  const api = useAxiosPrivate();
  const { getAsyncTasks, getTaskParametersByTaskName, setIsSubmit } =
    useARMContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [asyncTaskNames, setAsyncTaskNames] = useState<
    IARMAsynchronousTasksTypes[] | undefined
  >(undefined);
  const [parameters, setParameters] = useState<Record<string, string | number>>(
    selected?.kwargs || {}
  );
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
      // kwargs: action === "Edit Schedule" ? selected?.kwargs : parameters,
    });
  }, [parameters]);

  const FormSchema = z.object({
    user_schedule_name: z.string(),
    user_task_name: z.string(),
    parameters: z.record(z.union([z.string(), z.number()])),
    schedule: z.string().or(z.number()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_schedule_name: user_schedule_name,
      user_task_name: "",
      parameters: action === "Edit Schedule" ? selected?.kwargs : {},
      schedule: action === "Edit Schedule" ? selected?.schedule : "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.user_schedule_name !== "ad_hoc" && data.schedule === "0") {
      toast({
        title: "Info",
        description: `Schedule value should be greater than 0.`,
      });
      return;
    }

    const adHocPostData = {
      user_task_name: data.user_task_name,
      parameters: data.parameters,
    };
    const scheduleTaskPostData = {
      user_schedule_name: data.user_schedule_name,
      user_task_name: data.user_task_name,
      parameters: data.parameters,
      schedule: Number(data.schedule),
    };
    const updateScheduleTaskPostData = {
      parameters: data.parameters,
      schedule_minutes: Number(data.schedule),
    };
    console.log(updateScheduleTaskPostData, "updateScheduleTaskPostData");
    try {
      setIsLoading(true);
      let response;

      if (action === "Ad Hoc") {
        response = await api.post(
          `/asynchronous-requests-and-task-schedules/create-task-schedule`,
          adHocPostData
        );
      } else if (action === "Schedule A Task") {
        response = await api.post(
          `/asynchronous-requests-and-task-schedules/create-task-schedule`,
          scheduleTaskPostData
        );
      } else if (action === "Edit Schedule") {
        response = await api.put(
          `/asynchronous-requests-and-task-schedules/update-task-schedule/${selected?.task_name}/${selected?.redbeat_schedule_name}`,
          updateScheduleTaskPostData
        );
      }

      if (response) {
        toast({
          title: "Success",
          description: "Task schedule created successfully.",
        });
        form.reset();
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task schedule.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSubmit(Math.random() + 3 * 234);
    }
  };

  const handleGetParameters = async (value: string) => {
    try {
      setIsLoading(true);
      const results = await getTaskParametersByTaskName(value);
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

  return (
    <div
      className={`${
        user_schedule_name === "run_script" ? "" : "w-[50%] mx-auto my-10"
      } `}
    >
      {user_schedule_name !== "Ad Hoc" && (
        <div className="p-2 bg-slate-300 rounded-t mx-auto text-center font-bold flex justify-between">
          <h2>{action}</h2>
          <X onClick={() => handleCloseModal()} className="cursor-pointer" />
        </div>
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
            {(action === "Schedule A Task" || "Ad Hoc") &&
              action !== "Edit Schedule" && (
                <FormField
                  control={form.control}
                  name="user_task_name"
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
                                value={item.user_task_name}
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
          </div>
          <div className="pb-1">
            {user_schedule_name !== "Ad Hoc" && (
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="text"
                        placeholder="Schedule"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-winter-100">
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
          <Button type="submit" className="mt-5">
            {isLoading ? <div>Loading...</div> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskRequest;
