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
import { FC } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { api } from "@/Api/Api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { IARMTypes } from "@/types/interfaces/ARM.interface";

interface ICreateTaskProps {
  task_name: string;
  selected: IARMTypes[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseModal: () => void;
}
const CreateTask: FC<ICreateTaskProps> = ({
  task_name,
  selected,
  isLoading,
  setIsLoading,
  handleCloseModal,
}) => {
  const arm_url = import.meta.env.VITE_API_URL;
  const { isOpenModal } = useGlobalContext();

  console.log(selected, "selected");
  const FormSchema = z.object({
    user_task_name: z.string(),
    task_name: z.string(),
    execution_method: z.string(),
    script_name: z.string(),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      isOpenModal === "register_task"
        ? {
            user_task_name: "Task0",
            task_name: "tasks.task_02.run_script",
            execution_method: "Python",
            script_name: "test_01.py",
            description: "",
          }
        : {
            user_task_name: selected[0]?.user_task_name,
            task_name: selected[0]?.task_name,
            execution_method: selected[0]?.execution_method,
            script_name: selected[0]?.script_name,
            description: selected[0]?.description,
          },
  });
  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const postData = {
      user_task_name: data.user_task_name,
      task_name: data.task_name,
      execution_method: data.execution_method,
      script_name: data.script_name,
      description: data.description,
    };
    const putData = {
      execution_method: data.execution_method,
      script_name: data.script_name,
      description: data.description,
    };

    const registerTask = async () => {
      setIsLoading(true);
      try {
        await api.post(`${arm_url}/arm-tasks/register-task`, postData);

        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: "Info !!!",
            description: `Error : ${error.message}`,
          });
        }
      } finally {
        setIsLoading(false);
        reset();
      }
    };
    const editTask = async () => {
      setIsLoading(true);
      try {
        await api.put(
          `${arm_url}/arm-tasks/edit-task/${selected[0]?.task_name}`,
          putData
        );

        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: "Info !!!",
            description: `Error : ${error.message}`,
          });
        }
      } finally {
        setIsLoading(false);
        reset();
      }
    };

    try {
      isOpenModal === "register_task" && registerTask();
      isOpenModal === "edit_task" && editTask();
    } catch (error) {
      console.log(error);
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
      <div className="p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                      disabled={isOpenModal === "edit_task"}
                      placeholder="User Task Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                      disabled={isOpenModal === "edit_task"}
                      placeholder="Task Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="execution_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      type="text"
                      placeholder="Method"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
            <Button type="submit">
              {isLoading ? (
                <l-tailspin size="15" stroke="3" speed="0.9" color="white" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default CreateTask;
