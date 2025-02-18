import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import {
  IARMAsynchronousTasksTypes,
  IExecutionMethodsTypes,
} from "@/types/interfaces/ARM.interface";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useARMContext } from "@/Context/ARMContext/ARMContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ICreateTaskProps {
  task_name: string;
  selected: IARMAsynchronousTasksTypes[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseModal: () => void;
}
interface IChackboxTypes {
  srs?: string;
  sf?: string;
}
const AsynchronousRegisterEditTaskModal: FC<ICreateTaskProps> = ({
  task_name,
  selected,
  isLoading,
  setIsLoading,
  handleCloseModal,
}) => {
  const api = useAxiosPrivate();
  const { isOpenModal } = useGlobalContext();
  const { setIsSubmit, getManageExecutionMethods } = useARMContext();
  const [executionMethods, setExecutionMethods] = useState<
    IExecutionMethodsTypes[]
  >([]);
  const [selectedExecutionMethod, setSelectedExecutionMethod] =
    useState<IExecutionMethodsTypes>(executionMethods[0]);

  const [checkboxSelected, setCheckboxSelected] = useState<IChackboxTypes>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getManageExecutionMethods();
        if (res) setExecutionMethods(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   setSelectedExecutionMethod();
  // }, [selectedExecutionMethod]);

  const handleCheckboxChange = (name: string) => {
    if (name === "srs") {
      setCheckboxSelected((prev) => {
        if (prev?.srs === "Y") {
          form.setValue("srs", "N");
          return { ...prev, srs: "N" };
        } else {
          form.setValue("srs", "Y");
          return { ...prev, srs: "Y" };
        }
      });
    } else if (name === "sf") {
      setCheckboxSelected((prev) => {
        if (prev?.sf === "Y") {
          form.setValue("sf", "N");
          return { ...prev, sf: "N" };
        } else {
          form.setValue("sf", "Y");
          return { ...prev, sf: "Y" };
        }
      });
    }
  };

  const FormSchema = z.object(
    isOpenModal === "register_task"
      ? {
          user_task_name: z.string(),
          task_name: z.string(),
          execution_method: z.string(),
          script_name: z.string(),
          script_path: z.string(),
          description: z.string(),
          srs: z.string().optional(),
          sf: z.string().optional(),
        }
      : {
          user_task_name: z.string(),
          execution_method: z.string(),
          script_name: z.string(),
          description: z.string(),
          srs: z.string().optional(),
          sf: z.string().optional(),
        }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      isOpenModal === "register_task"
        ? {
            user_task_name: "",
            task_name: "",
            execution_method: selectedExecutionMethod?.execution_method,
            script_name: "",
            description: "",
            srs: "N",
            sf: "N",
            script_path: "",
          }
        : {
            user_task_name: selected[0]?.user_task_name,
            execution_method: selected[0]?.execution_method,
            script_name: selected[0]?.script_name,
            description: selected[0]?.description,
            srs: selected[0]?.srs,
            sf: selected[0]?.sf,
          },
  });
  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const postData = {
      user_task_name: data.user_task_name,
      task_name: data.task_name,
      executor: selectedExecutionMethod?.executor,
      execution_method: data.execution_method,
      internal_execution_method:
        selectedExecutionMethod?.internal_execution_method,
      script_name: data.script_name,
      script_path: data.script_path,
      description: data.description,
      srs: data.srs,
      sf: data.sf,
    };
    const putData = {
      user_task_name: data.user_task_name,
      execution_method: data.execution_method,
      script_name: data.script_name,
      description: data.description,
      srs: data.srs,
      sf: data.sf,
    };
    console.log(postData, "post,put");
    const registerTask = async () => {
      try {
        setIsLoading(true);
        await api.post(`/arm-tasks/register-task`, postData);

        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
        handleCloseModal();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: "Info !!!",
            variant: "destructive",
            description: `Error : ${error.message}`,
          });
        }
      } finally {
        setIsLoading(false);
        reset();
        setIsSubmit(Math.random() + 23 * 3000);
      }
    };
    const editTask = async () => {
      setIsLoading(true);
      try {
        await api.put(
          `/arm-tasks/edit-task/${selected[0]?.task_name}`,
          putData
        );

        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
        handleCloseModal();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: "Info !!!",
            variant: "destructive",
            description: `Error : ${error.message}`,
          });
        }
      } finally {
        setIsLoading(false);
        reset();
        setIsSubmit(Math.random() + 23 * 3000);
      }
    };

    try {
      if (isOpenModal === "register_task") {
        registerTask();
      } else if (isOpenModal === "edit_task") {
        editTask();
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast({
          title: "Info !!!",
          variant: "destructive",
          description: `Error : ${error.message}`,
        });
      }
    } finally {
      reset();
    }
  };

  return (
    <div>
      <div className="p-2 bg-slate-300 rounded-t mx-auto text-center font-bold flex justify-between">
        <h2>{task_name}</h2>
        <X onClick={() => handleCloseModal()} className="cursor-pointer" />
      </div>
      <div className="px-11 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={checkboxSelected?.srs === "Y"}
                  onClick={() => handleCheckboxChange("srs")}
                />
                <FormLabel>Standard Request Submission (SRS)</FormLabel>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={checkboxSelected?.sf === "Y"}
                  onClick={() => handleCheckboxChange("sf")}
                />
                <FormLabel>Step Function (SF)</FormLabel>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <FormField
                control={form.control}
                name="user_task_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Task Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        autoFocus
                        type="text"
                        placeholder="User Task Name"
                        className="px-2 h-8"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isOpenModal === "register_task" ? (
                <FormField
                  control={form.control}
                  name="task_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          type="text"
                          placeholder="Task Name"
                          className="px-2 h-8"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="execution_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Execution Method</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedItem = executionMethods.find(
                              (item) => item.execution_method === value
                            );
                            if (selectedItem) {
                              setSelectedExecutionMethod(selectedItem);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="px-2 h-8">
                            <SelectValue placeholder="Select Execution Method" />
                          </SelectTrigger>
                          <SelectContent>
                            {executionMethods.map((item) => (
                              <SelectItem
                                key={item.execution_method}
                                value={item.execution_method}
                              >
                                {item.execution_method}
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
            <div className="grid grid-cols-2 gap-10">
              {isOpenModal === "register_task" ? (
                <FormField
                  control={form.control}
                  name="execution_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Execution Method</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedItem = executionMethods.find(
                              (item) => item.execution_method === value
                            );
                            if (selectedItem) {
                              setSelectedExecutionMethod(selectedItem);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="px-2 h-8">
                            <SelectValue placeholder="Select Execution Method" />
                          </SelectTrigger>
                          <SelectContent>
                            {executionMethods.map((item) => (
                              <SelectItem
                                key={item.execution_method}
                                value={item.execution_method}
                              >
                                {item.execution_method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="script_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Script Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          type="text"
                          placeholder="Script Name"
                          className="px-2 h-8"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {isOpenModal === "register_task" && (
                <div>
                  <FormLabel htmlFor="Executor">Executor</FormLabel>
                  <Input
                    placeholder="Executor"
                    readOnly
                    disabled
                    className="my-2 px-2 h-8"
                    value={selectedExecutionMethod?.executor ?? "Executor"}
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-10">
              {isOpenModal === "register_task" && (
                <>
                  <FormField
                    control={form.control}
                    name="script_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Script Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            type="text"
                            placeholder="Script Name"
                            className="px-2 h-8"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="script_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Script Path</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            type="text"
                            placeholder="Script Path"
                            className="px-2 h-8"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Description" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">
                {isLoading ? (
                  <l-tailspin size="15" stroke="3" speed="0.9" color="white" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default AsynchronousRegisterEditTaskModal;
