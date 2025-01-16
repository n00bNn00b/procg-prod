import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  IManageAccessEntitlementsTypes,
  IManageAccessModelsTypes,
} from "@/types/interfaces/ManageAccessEntitlements.interface";
import { FC } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { ring } from "ldrs";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
interface IManageAccessEntitlementsProps {
  selectedItem?: IManageAccessEntitlementsTypes;
  items: IManageAccessModelsTypes[];
}
const AddForm: FC<IManageAccessEntitlementsProps> = ({ items }) => {
  const { createManageAccessModel } = useAACContext();
  const { token } = useGlobalContext();
  const maxId = Math.max(...items.map((data) => data.manage_access_model_id));
  const { isLoading } = useManageAccessEntitlementsContext();

  const FormSchema = z.object({
    model_name: z.string(),
    description: z.string(),
    type: z.string(),
    state: z.string().min(3, {
      message: "Select a option",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      model_name: "",
      description: "",
      type: "access",
      state: "approved",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const dateToday = new Date().toLocaleDateString("en-CA");
    const id = items.length > 0 ? maxId + 1 : 1;
    const postData = {
      manage_access_model_id: id,
      model_name: data.model_name,
      description: data.description,
      type: data.type,
      state: data.state,
      run_status: "",
      last_run_date: dateToday,
      created_by: token?.user_name,
      last_updated_by: token?.user_name,
      last_updated_date: dateToday,
      revision: 0,
      revision_date: dateToday,
    };
    createManageAccessModel(postData);
    form.reset();
  }

  ring.register();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2 p-2">
          <FormField
            control={form.control}
            name="model_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input required placeholder="Model Name" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input required placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  required
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="access">Access</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select
                  required
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="disapproved">Disapproved</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="ml-2" type="submit">
          {isLoading ? (
            <l-ring
              size="20"
              stroke="5"
              bg-opacity="0"
              speed="2"
              color="white"
            ></l-ring>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};
export default AddForm;
