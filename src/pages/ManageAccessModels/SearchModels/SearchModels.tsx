import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAACContext } from "@/Context/ManageAccessEntitlements/AdvanceAccessControlsContext";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const SearchModels = () => {
  const { users } = useGlobalContext();
  const { searchFilter, fetchManageAccessModels } = useAACContext();
  const FormSchema = z.object({
    match: z.string(),
    created_by: z.string(),
    model_name: z.string(),
    state: z.string(),
    last_run_date: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      match: "all",
      created_by: "",
      model_name: "",
      state: "",
      last_run_date: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    searchFilter(data);
  }
  users.map((user) => <h5>{user.user_name}</h5>);
  return (
    <div className="bg-slate-100 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 ">
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="match"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 justify-around">
                    <FormLabel className="mt-2">Match</FormLabel>
                    <FormControl className="flex mt-0">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex "
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">All</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mentions" />
                          </FormControl>
                          <FormLabel className="font-normal">Any</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="created_by"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">Created By</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-[50%] p-1 h-7 m-0">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user, index) => (
                          <SelectItem
                            value={user.user_name}
                            key={index}
                            className="capitalize"
                          >
                            {user.user_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model_name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">Model Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[50%] p-1 h-7 "
                        placeholder="Model Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">State</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-[50%] p-1 h-7 m-0">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="disapproved">Disapproved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_run_date"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">Last Run Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-[50%] p-1 h-7 "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col justify-center gap-2 my-3 w-20">
              <Button className="h-8 w-15" type="submit">
                Search
              </Button>
              <Button
                className="h-8 w-15"
                type="button"
                onClick={() => {
                  form.reset();
                  fetchManageAccessModels();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default SearchModels;
