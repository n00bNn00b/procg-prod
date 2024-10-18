import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { hourglass } from "ldrs";
import AddForm from "./AddForm";
import { useControlsContext } from "@/Context/ManageAccessEntitlements/ManageControlsContext";

const AddControl = () => {
  const { isLoading, token } = useGlobalContext();
  const { createControl } = useControlsContext();
  hourglass.register();
  const FormSchema = z.object({
    control_name: z.string().min(1, "Control Name is required"),
    description: z.string(),
    pending_results_count: z.string(),
    control_type: z.string(),
    priority: z.string(),
    datasources: z.string(),
    control_last_run: z.string(),
    control_last_updated: z.string(),
    status: z.string(),
    state: z.string(),
    result_investigator: z.string(),
    authorized_data: z.string(),
    revision: z.string(),
    revision_date: z.string(),
    created_by: z.string(),
    created_date: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      control_name: "",
      description: "",
      pending_results_count: "",
      control_type: "",
      priority: "",
      datasources: "",
      control_last_run: "",
      control_last_updated: "",
      status: "",
      state: "",
      result_investigator: "",
      authorized_data: "",
      revision: "",
      revision_date: "",
      created_by: "",
      created_date: "",
    },
  });
  const { reset } = form;
  const handleReset = () => {
    reset();
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const date = new Date().toLocaleDateString("en-CA");
    const postData = {
      control_id: 0,
      control_name: data.control_name,
      description: data.description,
      pending_results_count: Number(data.pending_results_count),
      control_type: data.control_type,
      priority: Number(data.priority),
      datasources: data.datasources,
      control_last_run: date,
      control_last_updated: date,
      status: data.status,
      state: data.status,
      result_investigator: data.result_investigator,
      authorized_data: token.user_name,
      revision: 0,
      revision_date: date,
      created_by: token.user_name,
      created_date: date,
    };
    // console.log(postData);
    try {
      createControl(postData);
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(userType);
  return (
    <div>
      <div className="w-[50%] py-6 mx-auto text-center font-bold text-2xl">
        <h1 className="text-4xl">Create Control</h1>
      </div>
      <div className="flex items-center justify-center ">
        <AddForm
          form={form}
          isLoading={isLoading}
          handleReset={handleReset}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddControl;
