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
import { IManageAccessEntitlementsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { FC } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { ring } from "ldrs";
import Spinner from "@/components/Spinner/Spinner";
interface IManageAccessEntitlementsProps {
  selectedItem?: IManageAccessEntitlementsTypes;
}
const ManageAccessPointsEntitleModal: FC<IManageAccessEntitlementsProps> = ({
  selectedItem,
}) => {
  console.log(selectedItem);
  const { token } = useGlobalContext();
  const {
    mangeAccessEntitlementAction,
    createManageAccessEntitlements,
    updateManageAccessEntitlements,
    isLoading,
    setSelected,
    table,
  } = useManageAccessEntitlementsContext();
  const currentDate = new Date().toLocaleDateString();
  const FormSchema = z.object({
    entitlement_name: z.string(),
    description: z.string(),
    comments: z.string(),
    status: z.string().min(3, {
      message: "Select a option",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      entitlement_name:
        mangeAccessEntitlementAction === "edit"
          ? selectedItem?.entitlement_name
          : "",
      description:
        mangeAccessEntitlementAction === "edit"
          ? selectedItem?.description
          : "",
      comments:
        mangeAccessEntitlementAction === "edit" ? selectedItem?.comments : "",
      status:
        mangeAccessEntitlementAction === "edit" ? selectedItem?.status : "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const id = selectedItem?.entitlement_id || 0;
    const putData = {
      entitlement_id: id,
      entitlement_name: data.entitlement_name,
      description: data.description,
      comments: data.comments,
      status: data?.status,
      effective_date: selectedItem?.effective_date || "",
      revison: selectedItem?.revison || 0,
      revision_date: selectedItem?.revision_date || "",
      created_on: selectedItem?.created_on || "",
      last_updated_on: selectedItem?.last_updated_on || "",
      last_updated_by: token.user_name,
      created_by: selectedItem?.created_by || "",
    };
    const postData = {
      entitlement_id: 0,
      entitlement_name: data.entitlement_name,
      description: data.description,
      comments: data.comments,
      status: data?.status,
      effective_date: currentDate,
      revison: 0,
      revision_date: currentDate,
      created_on: currentDate,
      last_updated_on: currentDate,
      last_updated_by: token.user_name,
      created_by: token.user_name,
    };
    if (mangeAccessEntitlementAction === "edit") {
      updateManageAccessEntitlements(id, putData);
      setSelected([]);
      table.getRowModel().rows.map((row: any) => row.toggleSelected(false));
    } else if (mangeAccessEntitlementAction === "add") {
      createManageAccessEntitlements(postData);
    }
  }

  ring.register();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2 p-2">
          <FormField
            control={form.control}
            name="entitlement_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entitlement Name</FormLabel>
                <FormControl>
                  <Input required placeholder="Entitlement Name" {...field} />
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
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Textarea placeholder="Comments" {...field} />
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
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a option" />
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
          {isLoading ? <Spinner color="white" size="20" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
export default ManageAccessPointsEntitleModal;
