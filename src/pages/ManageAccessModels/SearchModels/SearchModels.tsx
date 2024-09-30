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
const SearchModels = () => {
  const FormSchema = z.object({
    match: z.string(),
    create_by: z.string(),
    model_name: z.string(),
    status: z.string().min(3, {
      message: "Select a option",
    }),
    last_run_date: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // defaultValues: {
    //   match: "",
    //   create_by: "",
    //   model_name: "",
    //   status: "",
    //   last_run_date: "",
    // },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }
  return (
    <div className="bg-slate-100 p-4 border my-3 rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col ">
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
              name="create_by"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 gap-2 items-center">
                  <FormLabel className="mt-2">Created By</FormLabel>
                  <Select
                    required
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl className="w-[50%] p-1 h-7 m-0">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
              name="status"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 gap-2 items-center">
                  <FormLabel className="mt-2">Status</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl className="w-[50%] p-1 h-7 m-0">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2 my-3">
            <Button className="h-8" type="submit">
              Search
            </Button>
            <Button className="h-8" type="reset">
              Reset
            </Button>
            <Button className="h-8" type="submit">
              Save
            </Button>
          </div>
          {/* <Button className="ml-2" type="submit">
                {isLoading ? (
                    <l-ring
                      size="20"
                      stroke="5"
                      bg-opacity="0"
                      speed="2"
                      color="white"
                    ></l-ring>
                  ) : (
                    "Submit"
                  )}
              </Button> */}
        </form>
      </Form>
    </div>
  );
};
export default SearchModels;
