import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserTypes from "@/pages/Tools/SetupAndAdministration/user_type.json";
import JobTitleTypes from "@/pages/Tools/SetupAndAdministration/job_title.json";
import {
  IAddUserTypes,
  ITenantsTypes,
} from "@/types/interfaces/users.interface";
import { useEffect, useState } from "react";
import { hourglass } from "ldrs";

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
    // const submitAction =
    //   props === "add"
    //     ? createDataSource(postData)
    //     : updateDataSource(selected[0].data_source_id, postData);

    // submitAction
    //   .then(() => {
    //     setSave((prevSave) => prevSave + 1); // Refresh data
    //   })
    //   .catch((error) => {
    //     toast({
    //       title: "Error",
    //       description: `Failed to ${props === "add" ? "add" : "update"} data.`,
    //     });
    //     console.error("Submit error:", error);
    //   });
  };
  console.log(userType);
  return (
    <div className="border bg-slate-300 w-[50%] mx-auto rounded shadow-xl p-2">
      <div className="w-[50%] py-2 mx-auto text-center font-bold text-2xl">
        <h1>Create An Account</h1>
      </div>
      <div className="flex items-center justify-center ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="user_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select
                      required
                      onValueChange={(value) => {
                        setUserType(value);
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a User" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UserTypes.map((user) => (
                          <SelectItem
                            value={user.user_type}
                            key={user.user_type}
                            onChange={() => setUserType(user.user_type)}
                          >
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        autoFocus
                        type="text"
                        placeholder="User Name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <Select
                      required
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Job Title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JobTitleTypes.map((user) => (
                          <SelectItem value={user.value} key={user.value}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant ID</FormLabel>
                    <Select
                      required
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Tenant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tenants?.map((tenant) => (
                          <SelectItem
                            value={String(tenant.tenant_id)}
                            key={tenant.tenant_id}
                          >
                            {tenant.tenant_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {userType !== "system" && (
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          type="text"
                          placeholder="First Name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {userType !== "system" && (
                <FormField
                  control={form.control}
                  name="middle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Middle Name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {userType !== "system" && (
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          type="text"
                          placeholder="Last Name"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                disabled={token.user_type !== "system" && userType === "system"}
                control={form.control}
                name="email_addresses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@gmail.com"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                disabled={token.user_type !== "system" && userType === "system"}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="password"
                        placeholder="••••••••"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={token.user_type !== "system" && userType === "system"}
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="password"
                        placeholder="••••••••"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
            {token.user_type !== "system" && userType === "system" ? (
              <p className="text-red-500 text-center py-2 flex justify-center items-center gap-2">
                <l-hourglass
                  size="20"
                  bg-opacity="0.1"
                  speed="1.75"
                  color="red"
                ></l-hourglass>{" "}
                Login as a Admin.
              </p>
            ) : (
              ""
            )}
            <div className="flex gap-4 p-4">
              <Button
                className="w-full bg-red-300 hover:bg-red-500"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button className="w-full" type="submit">
                {isLoading ? (
                  <l-tailspin
                    size="30"
                    stroke="5"
                    speed="0.9"
                    color="white"
                  ></l-tailspin>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddUser;
