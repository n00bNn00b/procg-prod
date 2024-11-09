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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserTypes from "@/pages/Tools/Users/user_type.json";
import JobTitleTypes from "@/pages/Tools/Users/job_title.json";
import { Dispatch, FC, SetStateAction } from "react";
import { ITenantsTypes } from "@/types/interfaces/users.interface";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
interface AddFormProps {
  form: any;
  isLoading: boolean;
  userType: string;
  setUserType: Dispatch<SetStateAction<string>>;
  tenants: ITenantsTypes[] | undefined;
  handleReset: () => void;
  onSubmit: (data: any) => void;
}

const AddForm: FC<AddFormProps> = ({
  form,
  isLoading,
  userType,
  setUserType,
  tenants,
  handleReset,
  onSubmit,
}) => {
  // console.log(form.getValues(), "form");
  const { token } = useGlobalContext();
  return (
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
                    <Input {...field} type="text" placeholder="Middle Name" />
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
                    multiple={true}
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
            Reset Form
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
  );
};
export default AddForm;
