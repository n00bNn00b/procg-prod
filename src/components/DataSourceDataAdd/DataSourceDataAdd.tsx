import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ChevronDown } from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { AlertDialogCancel } from "../ui/alert-dialog";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import {
  IDataSourcePostTypes,
  IDataSourceTypes,
} from "@/types/interfaces/datasource.interface";

interface IDataSourceAddDataTypes {
  props: string;
  maxID?: number;
  selected: IDataSourceTypes[];
  editAble?: boolean;
  setSave: Dispatch<SetStateAction<number>>;
  setRowSelection: Dispatch<SetStateAction<{}>>;
}
const DataSourceDataAdd: FC<IDataSourceAddDataTypes> = ({
  props,
  selected,
  editAble,
  setSave,
  setRowSelection,
}) => {
  const { fetchDataSource, createDataSource, updateDataSource, token } =
    useGlobalContext();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props === "update") {
      const fetchDataFromAPI = async () => {
        if (selected[0]) {
          const result = await fetchDataSource(selected[0].data_source_id);
          form.reset(result); // Sync form with fetched data
        } else return;
      };
      fetchDataFromAPI();
    }
  }, [editAble, props, selected, fetchDataSource]);

  const FormSchema = z.object({
    datasource_name: z
      .string()
      .min(2, { message: "Datasource Name must be at least 2 characters." }),
    description: z
      .string()
      .min(2, { message: "Description must be at least 2 characters." }),
    application_type: z
      .string()
      .min(2, { message: "Application Type must be at least 2 characters." }),
    application_type_version: z.string().min(2, {
      message: "Application Type Version must be at least 2 characters.",
    }),
    last_access_synchronization_status: z.string().min(2, {
      message:
        "Last Access Synchronization Status must be at least 2 characters.",
    }),
    last_transaction_synchronization_status: z.string().min(2, {
      message:
        "Last Transaction Synchronization Status must be at least 2 characters.",
    }),
    default_datasource: z
      .string()
      .min(2, { message: "Default Datasource must be at least 2 characters." }),
    password: z
      .string()
      .min(2, { message: "Default Datasource must be at least 2 characters." }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      datasource_name: "",
      description: "",
      application_type: "EBS",
      application_type_version: "R12",
      last_access_synchronization_status: "COMPLETED",
      last_transaction_synchronization_status: "COMPLETED",
      default_datasource: "false",
      password: "1234567",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setRowSelection({});
    const postData: IDataSourcePostTypes = {
      datasource_name: data.datasource_name,
      description: data.description,
      application_type: "EBS",
      application_type_version: "R12",
      last_access_synchronization_status: "COMPLETED",
      last_transaction_synchronization_status: "COMPLETED",
      default_datasource: data.default_datasource,
      created_by: token.user_name,
      last_updated_by: token.user_name,
    };
    const submitAction =
      props === "add"
        ? createDataSource(postData)
        : updateDataSource(selected[0].data_source_id, postData);

    submitAction
      .then(() => {
        setSave((prevSave) => prevSave + 1); // Refresh data
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to ${props === "add" ? "add" : "update"} data.`,
        });
        console.error("Submit error:", error);
      });
  }

  const openProperties = () => {
    setOpen(!open);
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 8000);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-3 pb-2">
            <Button className="bg-slate-400">Test Connection</Button>

            <AlertDialogCancel
              disabled={
                form.getValues().datasource_name === "" ||
                form.getValues().description === ""
              }
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 hover:text-white text-white"
            >
              Save
            </AlertDialogCancel>
            <AlertDialogCancel disabled={isLoading} onClick={handleCancel}>
              {isLoading ? "loading" : "Close"}
            </AlertDialogCancel>
          </div>
          <h5>*Indicates required field</h5>

          <FormField
            control={form.control}
            name="datasource_name"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <label className="w-[50%] text-right mt-1 text-amber-800">
                  * Datasource Name
                </label>
                <FormControl>
                  <Input
                    {...field}
                    required
                    type="text"
                    autoFocus
                    className="py-3 h-0 w-[50%]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <label className="w-[50%] text-right mt-1 text-amber-800">
                  Description
                </label>
                <FormControl>
                  <Input
                    {...field}
                    required
                    type="text"
                    className="py-3 h-0 w-[50%]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-3 items-center justify-center">
            <label className="w-[50%] text-right text-amber-800">
              Application Type
            </label>
            <p className="w-[50%]">EBS</p>
          </div>
          <div className="flex gap-3 items-center justify-center">
            <label className="w-[50%] text-right text-amber-800">
              Application Type Version
            </label>
            <p className="w-[50%]">R12</p>
          </div>
          <FormField
            control={form.control}
            name="default_datasource"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <label className="w-[49%] text-right text-amber-800">
                  Default Source
                </label>
                <FormControl>
                  <Input
                    {...field}
                    type="checkbox"
                    checked={field.value === "true"}
                    onChange={(e) => {
                      field.onChange(e.target.checked ? "true" : "false");
                    }}
                    className="h-4 w-4 mt-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-3 items-center justify-center">
            <label className="w-[50%] text-right text-amber-800">
              Connector Type
            </label>
            <p className="w-[50%]">Default</p>
          </div>
          <div className="flex gap-3 items-center justify-center">
            <label className="w-[50%] text-right text-amber-800">
              Synchronization Type
            </label>
            <p className="w-[50%]">Transaction, Access</p>
          </div>
          {/* Connector Properties */}
          <div
            className={`${
              open ? "bg-slate-50" : ""
            } flex flex-col rounded p-2 mt-2`}
          >
            <div className="flex gap-3 font-bold">
              <ChevronDown
                onClick={openProperties}
                className={`p-1 shadow-2xl rounded shadow-slate-400 cursor-pointer ${
                  open ? "bg-slate-300" : "bg-slate-50"
                }`}
              />
              <h4>Connector Properties</h4>
            </div>
            <div className={`${open ? "h-full" : "h-0 opacity-0"}`}>
              <div className="flex gap-3 items-center justify-center">
                <label className="w-[40%] text-right text-amber-800">
                  ERP Database Type
                </label>
                <p className="w-[50%]">ORACLE</p>
              </div>
              <div className="flex gap-3 items-center justify-center">
                <label className="w-[40%] text-right text-amber-800">
                  Hostname
                </label>
                <p className="w-[50%]">xebsdb01.genesiscrudeoil.com</p>
              </div>
              <div className="flex gap-3 items-center justify-center">
                <label className="w-[40%] text-right text-amber-800">
                  Service Name
                </label>
                <p className="w-[50%]">EBSX</p>
              </div>
              <div className="flex gap-3 items-center justify-center">
                <label className="w-[40%] text-right text-amber-800">
                  Port
                </label>
                <p className="w-[50%]">1524</p>
              </div>
              <div className="flex gap-3 items-center justify-center">
                <label className="w-[40%] text-right text-amber-800">
                  Username
                </label>
                <p className="w-[50%]">apps</p>
              </div>
              <FormField
                control={form.control}
                name="password" // Renamed to "password" to match field name
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <label className="w-[44%] text-right mt-1 text-amber-800">
                      * Password
                    </label>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="py-3 h-0 w-[50%]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DataSourceDataAdd;
