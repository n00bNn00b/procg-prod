import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import Account from "./Account";

export default function Security() {
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
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-[30rem] mx-auto grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Account />
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-2"
              >
                <FormField
                  control={form.control}
                  name="old_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          {...field}
                          className="w-[20rem]"
                          type="password"
                        />
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
                          className="w-[20rem]"
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
                          className="w-[20rem]"
                          type="password"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>
                  {isLoading ? <Spinner color="white" size="23" /> : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
