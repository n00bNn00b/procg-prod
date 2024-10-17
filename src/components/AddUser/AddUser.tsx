import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import {
  IAddUserTypes,
  ITenantsTypes,
} from "@/types/interfaces/users.interface";
import { useEffect, useState } from "react";
import { hourglass } from "ldrs";
import AddForm from "./AddForm";

const AddUser = () => {
  const { createUser, token, fetchTenants, isLoading } = useGlobalContext();
  const [userType, setUserType] = useState<string>("person");
  const [tenants, setTenants] = useState<ITenantsTypes[] | undefined>([]);
  hourglass.register();
  useEffect(() => {
    const fetchTenantsData = async () => {
      try {
        const res = await fetchTenants();
        if (res) {
          setTenants(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTenantsData();
  }, []);
  const FormSchema = z
    .object({
      user_type: z.string(),
      user_name: z.string(),
      first_name: z.string(),
      middle_name: z.string().optional(),
      last_name: z.string(),
      job_title: z.string(),
      tenant_id: z.string(),
      email_addresses: z.union([
        z.string().email(),
        z.array(z.string().email()),
      ]),
      password: z.string().min(8, {
        message: "At least 8 characters.",
      }),
      confirm_password: z.string().min(8, {
        message: "At least 8 characters need.",
      }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_name: "",
      user_type: "person",
      email_addresses: "",
      tenant_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      // job_title: "",
      password: "",
      confirm_password: "",
    },
  });
  const { reset } = form;
  const handleReset = () => {
    reset();
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);

    const postData: IAddUserTypes = {
      user_type: data.user_type,
      user_name: data.user_name,
      email_addresses: Array.isArray(data.email_addresses)
        ? data.email_addresses
        : [data.email_addresses],
      created_by: token.user_id,
      last_updated_by: token.user_id,
      tenant_id: Number(data.tenant_id),
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      job_title: data.job_title,
      password: data.password,
    };
    try {
      createUser(postData);
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  console.log(userType);
  return (
    <div className="border bg-slate-300 w-[50%] mx-auto rounded shadow-xl p-2">
      <div className="w-[50%] py-2 mx-auto text-center font-bold text-2xl">
        <h1>Create An Account</h1>
      </div>
      <div className="flex items-center justify-center ">
        <AddForm
          form={form}
          isLoading={isLoading}
          userType={userType}
          setUserType={setUserType}
          tenants={tenants}
          handleReset={handleReset}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddUser;
