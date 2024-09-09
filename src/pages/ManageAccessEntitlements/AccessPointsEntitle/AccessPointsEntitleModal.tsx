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
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { ring } from "ldrs";
const AccessPointsEntitleModal = () => {
  const {
    selectedManageAccessEntitlements,
    createAccessPointsEntitlement,
    isLoading,
  } = useManageAccessEntitlementsContext();
  const FormSchema = z.object({
    element_name: z.string(),
    description: z.string(),
    datasource: z.string(),
    platform: z.string(),
    element_type: z.string(),
    access_control: z.string(),
    change_control: z.string(),
    audit: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      element_name: "",
      description: "",
      datasource: "",
      platform: "",
      element_type: "",
      access_control: "",
      change_control: "",
      audit: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const postData = {
      entitlement_id: selectedManageAccessEntitlements?.entitlement_id
        ? selectedManageAccessEntitlements.entitlement_id
        : 0,
      element_name: data.element_name,
      description: data.description,
      datasource: data.datasource,
      platform: data.platform,
      element_type: data.element_type,
      access_control: data.access_control,
      change_control: data.change_control,
      audit: data.audit,
    };
    createAccessPointsEntitlement(postData);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  ring.register();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2 p-2">
          <FormField
            control={form.control}
            name="element_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Element Name</FormLabel>
                <FormControl>
                  <Input placeholder="Element Name" {...field} />
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
                  <Input placeholder="description" {...field} />
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
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <FormControl>
                  <Input placeholder="Platform" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="element_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Element Type</FormLabel>
                <FormControl>
                  <Input placeholder="Element Type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="access_control"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Control</FormLabel>
                <Select required onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="change_control"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change Control</FormLabel>
                <FormControl>
                  <Input placeholder="Change Control" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audit</FormLabel>
                <FormControl>
                  <Input placeholder="Audit" {...field} />
                </FormControl>
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
export default AccessPointsEntitleModal;
