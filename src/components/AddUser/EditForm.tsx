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

const EditForm: FC<AddFormProps> = ({
  form,
  isLoading,
  userType,
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
                    {JobTitleTypes.map((item) => (
                      <SelectItem value={item.value} key={item.value}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
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
                  <Input {...field} type="password" placeholder="••••••••" />
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
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormMessage />

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
export default EditForm;
