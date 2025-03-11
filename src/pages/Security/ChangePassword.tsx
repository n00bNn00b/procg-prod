import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IUserPasswordResetTypes } from "@/types/interfaces/users.interface";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import Spinner from "@/components/Spinner/Spinner";

interface IChangePasswordProps {
  setIsOpenUpdateBtn: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePassword = ({ setIsOpenUpdateBtn }: IChangePasswordProps) => {
  const { isLoading, token, resetPassword } = useGlobalContext();
  const FormSchema = z
    .object({
      old_password: z.string().min(6, {
        message: "At least 6 characters.",
      }),
      new_password: z.string().min(6, {
        message: "At least 6 characters.",
      }),
      confirm_password: z.string().min(6, {
        message: "At least 6 characters need.",
      }),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const putData: IUserPasswordResetTypes = {
      user_id: token?.user_id || 0,
      old_password: data.old_password,
      new_password: data.new_password,
    };
    try {
      resetPassword(putData);
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
    }
  }
  return (
    <div className="py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="******"
                    {...field}
                    type="password"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="******"
                    {...field}
                    type="password"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse gap-1">
            <Button>
              {isLoading ? (
                <Spinner color="white" size="23" />
              ) : (
                "Change Password"
              )}
            </Button>
            <Button onClick={() => setIsOpenUpdateBtn(false)}>Cancel</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ChangePassword;
