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
import JobTitleTypes from "@/pages/Tools/SecurityConsole/ManageUsers/job_title.json";
import { Dispatch, FC, SetStateAction } from "react";
import { ITenantsTypes } from "@/types/interfaces/users.interface";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { FieldValues, UseFormReturn } from "react-hook-form";
interface AddFormProps {
  form: UseFormReturn<FieldValues>;
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
                <FormLabel className="font-normal">User Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
                <FormLabel className="font-normal">Job Title</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
                <FormLabel className="font-normal">First Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="First Name" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Middle Name</FormLabel>
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
                <FormLabel className="font-normal">Last Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Last Name" />
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
                <FormLabel className="font-normal">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="example@gmail.com"
                    multiple={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={token.user_type !== "system" && userType === "system"}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={token.user_type !== "system" && userType === "system"}
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
