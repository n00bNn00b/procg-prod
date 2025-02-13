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
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { IExecutionMethodsTypes } from "@/types/interfaces/ARM.interface";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useARMContext } from "@/Context/ARMContext/ARMContext";

interface ICreateTaskProps {
  action: string;
  selected: IExecutionMethodsTypes[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseModal: () => void;
}
const ExecutionMethodEdit: FC<ICreateTaskProps> = ({
  action,
  selected,
  isLoading,
  setIsLoading,
  handleCloseModal,
}) => {
  const api = useAxiosPrivate();
  const { isOpenModal } = useGlobalContext();
  const { setIsSubmit } = useARMContext();

  const FormSchema = z.object(
    isOpenModal === "create_execution_methods"
      ? {
        execution_method: z.string(),
        internal_execution_method: z.string(),
        executor: z.string(),
        description: z.string()
        }
      : {
        execution_method: z.string(),
        executor: z.string(),
        description: z.string()
        }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      isOpenModal === "create_execution_methods"
        ? {
          execution_method: "",
          internal_execution_method: "",
          executor: "",
          description: ""
          }
        : {
          execution_method: selected[0]?.execution_method,
          executor: selected[0]?.executor,
          description: selected[0]?.description
          },
  });
  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const postData = {
      execution_method:data.execution_method,
      internal_execution_method: data.internal_execution_method,
      executor: data.executor,
      description: data.description
    };
    const putData = {
      execution_method:data.execution_method, 
      executor: data.executor,
      description: data.description
    }; 
    const registerTask = async () => {
      try {
        setIsLoading(true);
        const res = await api.post(`/arm-tasks/create-execution-method`, postData);

      if(res){
        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
        handleCloseModal();
      }
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
        const res = await api.put(
          `/arm-tasks/update-execution-method/${selected[0]?.internal_execution_method}`,
          putData
        );
        if(res){
        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
        handleCloseModal();}
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
      if (isOpenModal === "create_execution_methods") {
        registerTask();
      } else if (isOpenModal === "edit_execution_methods") {
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
        <h2>{action}</h2>
        <X onClick={() => handleCloseModal()} className="cursor-pointer" />
      </div>
      <div className="px-11 p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-2 gap-10"> 
                <FormField
                  control={form.control}
                  name="execution_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Execution Method</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          type="text"
                          placeholder="Execution Method"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                /> 
                {
                  action !=="Edit Execution Method" && (<FormField
                    control={form.control}
                    name="internal_execution_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Execution Method</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            type="text"
                            placeholder="Internal Execution Method"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />)
                }
                
            </div> 
            <div className="grid grid-cols-2 gap-10">
              <FormField
                control={form.control}
                name="executor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Executor</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="text"
                        placeholder="Executor"
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> 
            </div>
            
            <div className=" "> 
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
            </div>
            
            <div className="fixed bottom-4 right-7 p-4">
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
export default ExecutionMethodEdit;
