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
import { IManageGlobalConditionTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { FC } from "react";
import { ring } from "ldrs";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
interface IManageGlobalConditionProps {
  selectedItem?: IManageGlobalConditionTypes;
}
const ManageGlobalConditionsModal: FC<IManageGlobalConditionProps> = () => {
  // const { updateManageAccessEntitlements, isLoading, setSelected, table } =
  //   useManageAccessEntitlementsContext();
  const { createManageGlobalCondition, manageGlobalConditions, isLoading } =
    useAACContext();
  const maxId = Math.max(
    ...manageGlobalConditions.map((item) => item.manage_global_condition_id)
  );
  const FormSchema = z.object({
    name: z.string(),
    description: z.string(),
    datasource: z.string(),
    status: z.string().min(3, {
      message: "Select a option",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      datasource: "",
      status: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const postData = {
        manage_global_condition_id: maxId,
        name: data.name,
        description: data.description,
        datasource: data.datasource,
        status: data.status,
      };
      createManageGlobalCondition(postData);
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
    }

    // table.getRowModel().rows.map((row: any) => row.toggleSelected(false));
  }

  ring.register();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2 p-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input required placeholder="Name" {...field} />
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
            name="datasource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datasource</FormLabel>
                <FormControl>
                  <Input placeholder="Datasource" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  required
                  value={field.value} // Use value instead of defaultValue
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
export default ManageGlobalConditionsModal;
