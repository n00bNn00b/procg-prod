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

interface ITaskParametersModalProps {
  task_name: string;
  selected: IARMTaskParametersTypes[];
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
            parameter_name: selected[0].parameter_name,
            data_type: selected[0].data_type,
            description: selected[0].description,
          },
  });
  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const submitData = {
      parameters: [
        {
          parameter_name: data.parameter_name,
          data_type: data.data_type,
          description: data.description,
        },
      ],
      created_by: token.user_id,
    };

    const addTaskParams = async () => {
      try {
        setIsLoading(true);
        const res = await api.post(
          `/arm-task-parameters/add-task-params/${selectedTask}`,
          submitData
        );
        console.log(res.data, "rrr");
        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
      } catch (error) {
        toast({
          title: "Info !!!",
          description: `Error : Failed to create task parameters.`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        reset();
        setIsSubmit(3);
      }
    };
    const updateParams = async () => {
      try {
        setIsLoading(true);
        await api.put(
          `/arm-task-parameters/update-task-params/${selectedTask}/${selected[0].arm_param_id}`,
          submitData.parameters
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
        setIsSubmit(4);
      }
    };

    try {
      isOpenModal === "add_task_params" && addTaskParams();
      isOpenModal === "update_task_params" && updateParams();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      reset();
      setIsSubmit(1);
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
              name="parameter_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>parameter_name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      autoFocus
                      type="text"
                      placeholder="parameter_name"
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
                  <FormLabel>data_type</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      type="text"
                      placeholder="data_type"
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
export default TaskParametersModal;
