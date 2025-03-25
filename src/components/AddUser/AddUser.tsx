import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import {
  IAddUserTypes,
  ITenantsTypes,
  IUpdateUserTypes,
  IUsersInfoTypes,
} from "@/types/interfaces/users.interface";
import { FC, useEffect, useState } from "react";
import { hourglass } from "ldrs";
import AddForm from "./AddForm";
import { X } from "lucide-react";
import EditForm from "./EditForm";
interface IAddUserProps {
  selected: IUsersInfoTypes[];
  handleCloseModal: () => void;
}
const AddUser: FC<IAddUserProps> = ({ selected, handleCloseModal }) => {
  const {
    createUser,
    token,
    fetchTenants,
    isLoading,
    updateUser,
    isOpenModal,
  } = useGlobalContext();
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
    .object(
      isOpenModal === "create_user"
        ? {
            user_type: z.string(),
            user_name: z.string(),
            first_name: z.string(),
            middle_name: z.string().optional(),
            last_name: z.string().optional(),
            job_title: z.string(),
            tenant_id: z.string(),
            email_addresses: z
              .string() // Ensure it's a string
              .transform((val) => val.split(",").map((email) => email.trim())) // Split by commas and trim spaces
              .refine(
                (emails) =>
                  emails.every(
                    (email) => z.string().email().safeParse(email).success // Validate each email
                  ),
                {
                  message: "One or more emails are invalid.",
                }
              ),
            password: z.string().min(8, {
              message: "At least 8 characters.",
            }),
            confirm_password: z.string().min(8, {
              message: "At least 8 characters need.",
            }),
          }
        : {
            user_name: z.string(),
            first_name: z.string(),
            middle_name: z.string().optional(),
            last_name: z.string().optional(),
            job_title: z.string(),
            email_addresses: z
              .string() // Ensure it's a string if provided
              .optional() // Make it optional
              .transform((val) =>
                val ? val.split(",").map((email) => email.trim()) : []
              ) // If there's a value, split and trim; otherwise, return an empty array
              .refine(
                (emails) =>
                  emails.every(
                    (email) => z.string().email().safeParse(email).success // Validate each email
                  ),
                {
                  message: "One or more emails are invalid.",
                }
              ),
            password: z
              .string()
              .min(8, {
                message: "At least 8 characters.",
              })
              .optional(),
            confirm_password: z
              .string()
              .min(8, {
                message: "At least 8 characters need.",
              })
              .optional(),
          }
    )
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      isOpenModal === "create_user"
        ? {
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
          }
        : {
            user_name: selected[0].user_name,
            job_title: selected[0].job_title,
            email_addresses: Array.isArray(selected[0].email_addresses)
              ? selected[0].email_addresses.join(",")
              : // If it's an array, join the emails into a string
                selected[0].email_addresses,
            // If it's already a string, just leave it
            password: "",
            confirm_password: "",
            first_name: selected[0].first_name,
            middle_name: selected[0].middle_name,
            last_name: selected[0].last_name,
          },
  });
  const { reset } = form;
  const handleReset = () => {
    reset();
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
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
    const putData: IUpdateUserTypes = {
      user_name: data.user_name,
      job_title: data.job_title,
      email_addresses: Array.isArray(data.email_addresses)
        ? data.email_addresses
        : [data.email_addresses],
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      password: data.password,
    };

    try {
      isOpenModal === "create_user" && createUser(postData);
      isOpenModal === "edit_user" && updateUser(selected[0].user_id, putData);
    } catch (error) {
      console.log(error);
    } finally {
      reset();
      handleCloseModal();
    }
  };
  return (
    <div className="border rounded shadow-xl">
      <div className="p-2 bg-slate-300 rounded-t mx-auto text-center font-bold flex justify-between">
        {isOpenModal === "edit_user" ? (
          <h1>Edit An Account</h1>
        ) : (
          <h1>Create An Account</h1>
        )}
        <X onClick={() => handleCloseModal()} className="cursor-pointer" />
      </div>
      <div className="p-2">
        {isOpenModal === "edit_user" ? (
          <EditForm
            form={form}
            isLoading={isLoading}
            userType={userType}
            setUserType={setUserType}
            tenants={tenants}
            handleReset={handleReset}
            onSubmit={onSubmit}
          />
        ) : (
          <AddForm
            form={form}
            isLoading={isLoading}
            userType={userType}
            setUserType={setUserType}
            tenants={tenants}
            handleReset={handleReset}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AddUser;
