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
import { toast } from "@/components/ui/use-toast";
import { IManageAccessEntitlementsTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
import { FC } from "react";
import { Textarea } from "@/components/ui/textarea";
interface IManageAccessEntitlementsProps {
  selectedItem?: IManageAccessEntitlementsTypes; // Optional prop
}
const ManageAccessPointsEntitleModal: FC<IManageAccessEntitlementsProps> = ({
  selectedItem,
}) => {
  console.log(selectedItem);
  // const selectData=
  // const { selectedManageAccessEntitlements, createAccessPointsEntitlement } =
  //   useManageAccessEntitlementsContext();
  const FormSchema = z.object({
    entitlement_name: z.string(),
    description: z.string(),
    comments: z.string(),
    status: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      entitlement_name: selectedItem?.entitlement_name,
      description: selectedItem?.description,
      comments: selectedItem?.comments,
      status: selectedItem?.status,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // const postData = {
    //   entitlement_id: selectedManageAccessEntitlements?.entitlement_id
    //     ? selectedManageAccessEntitlements.entitlement_id
    //     : 0,
    //   element_name: data.element_name,
    //   description: data.description,
    //   datasource: data.datasource,
    //   platform: data.platform,
    //   element_type: data.element_type,
    //   access_control: data.access_control,
    //   change_control: data.change_control,
    //   audit: data.audit,
    // };
    // createAccessPointsEntitlement(postData);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
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
                  <Input placeholder="Entitlement Name" {...field} />
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
                  <Input placeholder="Description" {...field} />
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
                  value={field.value}
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
              </FormItem>
            )}
          />
        </div>
        <Button className="ml-2" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default ManageAccessPointsEntitleModal;
