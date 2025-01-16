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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
import { FC } from "react";
interface IManageGlobalConditionProps {
  form: any;
}
const ManageAccessModelUpdate: FC<IManageGlobalConditionProps> = ({ form }) => {
  const { dataSources } = useAACContext();
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
              <FormItem className="col-span-2">
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

           */}
          <FormField
            control={form.control}
            name="datasource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datasource</FormLabel>
                <Select
                  required
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="px-1 h-6">
                      <SelectValue placeholder="Select a option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dataSources.map((data) => (
                      <SelectItem
                        key={data.data_source_id}
                        value={data.datasource_name}
                      >
                        {data.datasource_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        "data sources if resume clear this field (work only data fetching)"
      </form>
    </Form>
  );
};
export default ManageAccessModelUpdate;
