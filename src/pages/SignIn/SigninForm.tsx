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
import axios from "axios";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useNavigate } from "react-router-dom";

interface SignInFormProps {
  setIsWrongCredential: React.Dispatch<React.SetStateAction<boolean>>;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const SignInForm = ({ setIsWrongCredential }: SignInFormProps) => {
  const { setToken, isLoading, setIsLoading } = useGlobalContext();
  const navigate = useNavigate();
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
      const response = await axios.post(`${url}/api/v2/login`, data);
      console.log("Response:", response.data);
      setToken(response.data);
      setIsWrongCredential(false);
      localStorage.setItem("token", JSON.stringify(response.data));
      localStorage.setItem("user_name", response.data.user_name);
      setIsLoading(false);
      if (response.data) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsWrongCredential(true);
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
            type="submit"
            className="w-full py-2 rounded-md bg-Red-200 hover:bg-Red-200/90 text-white "
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
