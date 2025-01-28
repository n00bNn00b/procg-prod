import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { IAsynchronousRequestsAndTaskSchedulesTypes } from "@/types/interfaces/ARM.interface";
interface ITaskRequestTypes {
  action: string;
  selected: IAsynchronousRequestsAndTaskSchedulesTypes;
  handleCloseModal: () => void;
}
const EditSchedule: FC<ITaskRequestTypes> = ({
  action,
  selected,
  handleCloseModal,
}) => {
  const api = useAxiosPrivate();
  const { token } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const FormSchema = z.object({
    user_schedule_name: z.string(),
    task_name: z.string(),
    args: z.string().or(z.array(z.string())),
    employee_id: z.string(),
    schedule: z.string(),
    cancelled_yn: z.string(),
  });
  console.log(selected.user_schedule_name, "selected");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      action === "edit"
        ? {
            user_schedule_name: selected?.user_schedule_name,
            task_name: selected.task_name,
            args: selected.args[0],
            employee_id: String(selected.kwargs.employee_id),
            schedule: String(selected.schedule),
            cancelled_yn: selected.cancelled_yn,
          }
        : {
            user_schedule_name: "add_hoc",
            task_name: "tasks.task_02.run_script",
            args: ["/d01/def/app/server/flask/python_scripts/test_01.py"],
            employee_id: "1",
            schedule: "0",
            cancelled_yn: "N",
          },
  });
  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.user_schedule_name !== "ad_hoc" && data.schedule === "0") {
      toast({
        title: "Info !!!",
        description: `Schedule value should be greater than 0.`,
      });
      return;
    }
    const rawArgs = Array.isArray(data.args) ? data.args.join(",") : data.args;
    const args = rawArgs.split(",").map((item) => item.trim());
    const postData = {
      user_schedule_name: data.user_schedule_name,
      task_name: data.task_name,
      args,
      kwargs_values: {
        employee_id: Number(data.employee_id),
      },
      schedule: Number(data.schedule),
      cancelled_yn: data.cancelled_yn,
      created_by: token.user_id,
    };

    const addTaskParams = async () => {
      try {
        setIsLoading(true);
        console.log(postData, "postData");
        const res = await api.post(
          `/asynchronous-requests-and-task-schedules/create-ad-hoc-task-schedule`,
          postData
        );
        console.log(res.data, "res");
        toast({
          title: "Info !!!",
          description: `Added successfully.`,
        });
      } catch (error) {
        toast({
          title: "Info !!!",
          description: `Error : Failed to run ad-hoc request.`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        reset();
      }
    };
    try {
      await addTaskParams();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      reset();
    }
  };
  return (
    <div>
      <div className="p-2 bg-slate-300 rounded-t mx-auto text-center font-bold flex justify-between">
        <h2>{action}</h2>
        <X onClick={() => handleCloseModal()} className="cursor-pointer" />
      </div>
      <div className="p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" p-4">
            <div className="grid grid-cols-2 gap-4">
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
                        disabled={selected.user_schedule_name === "ad-hoc"}
                        type="text"
                        placeholder="User Schedule Name"
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
                        placeholder="Task Name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="args"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Argument</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="text"
                        placeholder="Argument"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Id</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="number"
                        placeholder="Employee Id"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="cancelled_yn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancelled</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Cancelled" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N">N</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="mt-5 flex justify-self-end">
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
export default EditSchedule;
