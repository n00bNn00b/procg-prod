import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC } from "react";
interface IManageGlobalConditionProps {
  form: any;
}
const ManageAccessModelUpdate: FC<IManageGlobalConditionProps> = ({ form }) => {
  return (
    <Form {...form}>
      <form>
        <div className="grid grid-cols-4 gap-2 p-2">
          <FormField
            control={form.control}
            name="model_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Name"
                    {...field}
                    className="px-1 h-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Description"
                    {...field}
                    className="px-1 h-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="datasource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datasource</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Datasource"
                    {...field}
                    className="px-1 h-6"
                  />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl className="px-1 h-6">
                    <SelectTrigger>
                      <SelectValue>
                        {field.value === "active"
                          ? "Active"
                          : "Inactive" || "Select a status"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          /> */}
        </div>
      </form>
    </Form>
  );
};
export default ManageAccessModelUpdate;
