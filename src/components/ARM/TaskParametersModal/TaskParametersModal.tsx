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
import { FC, useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { IARMTaskParametersTypes } from "@/types/interfaces/ARM.interface";
import { useARMContext } from "@/Context/ARMContext/ARMContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ITaskParametersModalProps {
  task_name: string;
  selected: IARMTaskParametersTypes;
  handleCloseModal: () => void;
}
const TaskParametersModal: FC<ITaskParametersModalProps> = ({
  task_name,
  selected,
  handleCloseModal,
}) => {
  const api = useAxiosPrivate();
  const { isOpenModal, token } = useGlobalContext();
  const { selectedTask, setIsSubmit } = useARMContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const FormSchema = z.object({
    parameter_name: z.string(),
    data_type: z.string(),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      isOpenModal === "add_task_params"
        ? {
            parameter_name: "",
            data_type: "",
            description: "",
          }
        : {
            parameter_name: selected.parameter_name,
            data_type: selected.data_type,
            description: selected.description,
          },
  });
  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const postData = {
      parameters: [
        {
          parameter_name: data.parameter_name,
          data_type: data.data_type,
          description: data.description,
        },
      ],
      created_by: token.user_id,
    };
    const putData = {
      parameter_name: data.parameter_name,
      data_type: data.data_type,
      description: data.description,
    };

    const addTaskParams = async () => {
      try {
        setIsLoading(true);
        await api.post(
          `/arm-tasks/add-task-params/${selectedTask?.task_name}`,
          postData
        );
        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
        handleCloseModal();
      } catch (error) {
        toast({
          title: "Info !!!",
          description: `Error : Failed to create task parameters.`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        reset();
        setIsSubmit(Math.random() + 23 * 3000);
      }
    };
    const updateParams = async () => {
      try {
        setIsLoading(true);
        await api.put(
          `/arm-tasks/update-task-params/${selectedTask?.task_name}/${selected.arm_param_id}`,
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
      if (isOpenModal === "add_task_params") {
        addTaskParams();
      } else if (isOpenModal === "update_task_params") {
        updateParams();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="p-2 bg-slate-300 rounded-t mx-auto text-center font-bold flex justify-between">
        <h2>{task_name}</h2>
        <X onClick={() => handleCloseModal()} className="cursor-pointer" />
      </div>
      <div className="px-11 p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-2 gap-10">
              <FormField
                control={form.control}
                name="parameter_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parameter Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        autoFocus
                        type="text"
                        placeholder="Parameter Name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Data Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VARCHAR">VARCHAR</SelectItem>
                          <SelectItem value="integer">integer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
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
export default TaskParametersModal;
