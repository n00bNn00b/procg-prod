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
import { useManageAccessEntitlementsContext } from "@/Context/ManageAccessEntitlements/ManageAccessEntitlementsContext";
import { ring } from "ldrs";
import { useEffect, useState } from "react";
import { IDataSourceTypes } from "@/types/interfaces/datasource.interface";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { IFetchAccessPointsElementTypes } from "@/types/interfaces/ManageAccessEntitlements.interface";
const AccessPointsEntitleModal = () => {
  const {
    selectedManageAccessEntitlements,
    createAccessPointsEntitlement,
    isLoading,
    createAccessEntitlementElements,
    accessPointStatus,
  } = useManageAccessEntitlementsContext();
  const { token } = useGlobalContext();
  const [dataSources, setDataSources] = useState<IDataSourceTypes[]>([]);
  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const res = async () => {
      const res = await axios.get<IDataSourceTypes[]>(
        `${url}/api/v2/data-sources`
      );
      setDataSources(res.data);
    };
    res();
  }, []);

  const FormSchema = z.object({
    element_name: z.string(),
    description: z.string(),
    data_source_id: z.string(),
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
      data_source_id: "",
      platform: "",
      element_type: "",
      access_control: "",
      change_control: "",
      audit: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const postData = {
      data_source_id: Number(data.data_source_id),
      element_name: data.element_name,
      description: data.description,
      platform: data.platform,
      element_type: data.element_type,
      access_control: data.access_control,
      change_control: data.change_control,
      audit: data.audit,
      created_by: token.user_name,
      last_updated_by: token.user_name,
    };
    console.log(postData, selectedManageAccessEntitlements);
    console.log(data.data_source_id, "datasource");
    console.log(typeof data.data_source_id, "datasource");
    const postAccessPointsElement = async () => {
      const url = import.meta.env.VITE_API_URL;
      //get max access point id
      const res = await axios.get(`${url}/api/v2/access-points-element`);
      const accessPointsMaxId =
        res.data.length > 0
          ? Math.max(
              ...res.data.map(
                (data: IFetchAccessPointsElementTypes) => data.access_point_id
              )
            ) + 1
          : 1;

      await createAccessPointsEntitlement(postData)
        .then((res) => {
          if (accessPointStatus === "createWithEntitlementId") {
            if (res === 201) {
              createAccessEntitlementElements(
                selectedManageAccessEntitlements?.entitlement_id
                  ? selectedManageAccessEntitlements.entitlement_id
                  : 0,
                [accessPointsMaxId]
              );
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          form.reset();
          // await fetchAccessPointsEntitlement(selected[0]);
        });
    };
    postAccessPointsElement();
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
            name="data_source_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datasource</FormLabel>
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
                    {dataSources.length > 0 ? (
                      <>
                        {dataSources.map((datasource) => (
                          <SelectItem
                            key={datasource.data_source_id}
                            value={String(datasource.data_source_id)}
                          >
                            {datasource.datasource_name}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <span className="mx-2">No Item Found !!</span>
                    )}
                  </SelectContent>
                </Select>
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
