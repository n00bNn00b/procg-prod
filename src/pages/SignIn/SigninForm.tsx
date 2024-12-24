import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface SignInFormProps {
  setIsWrongCredential: React.Dispatch<React.SetStateAction<boolean>>;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const SignInForm = ({ setIsWrongCredential }: SignInFormProps) => {
  const api = useAxiosPrivate();
  const { setToken, isLoading, setIsLoading } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const url = import.meta.env.VITE_API_URL;
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      await api.post(`${url}/login`, data);
      const response = await api.get(`/auth/user`);
      console.log("Response:", response.data);
      setToken(response.data);
      setIsWrongCredential(false);
      // localStorage.setItem("token", JSON.stringify(response.data));
      // localStorage.setItem("user_name", response.data.user_name);
      localStorage.setItem("loggedInUser", "true");
      setIsLoading(false);
      if (response.data) {
        navigate(location?.state ? location?.state : "/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[496px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-dark-400 ">Email</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="border h-8 outline-none rounded-md pl-2 text-dark-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-dark-400 ">Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    className="border h-8 outline-none rounded-md pl-2 text-dark-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            disabled={isLoading}
            type="submit"
            className={`${
              isLoading && "cursor-not-allowed"
            } w-full py-2 rounded-md bg-Red-200 hover:bg-Red-200/90 text-white`}
          >
            {isLoading ? (
              <l-tailspin size="15" stroke="3" speed="0.9" color="white" />
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
