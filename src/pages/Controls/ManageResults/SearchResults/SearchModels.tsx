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
import { useControlsContext } from "@/Context/ManageAccessEntitlements/ManageControlsContext";

const SearchModels = () => {
  const { searchFilter, fetchControls } = useControlsContext();
  const FormSchema = z.object({
    match: z.string(),
    control_name: z.string(),
    control_type: z.string(),
    priority: z.string(),
    datasources: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      match: "all",
      control_name: "",
      control_type: "",
      priority: "",
      datasources: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    searchFilter(data);
  }

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
                name="control_name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">Control Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[50%] p-1 h-7 "
                        placeholder="Control Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="control_type"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">Control Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-[50%] p-1 h-7 m-0">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="access">Approved</SelectItem>
                        <SelectItem value="disapproved">Disapproved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">Priority</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="w-[50%] p-1 h-7 "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="datasources"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 gap-2 items-center">
                    <FormLabel className="mt-2">Datasources</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                  fetchControls();
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
