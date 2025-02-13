import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, FC, SetStateAction } from "react";
import { IScheduleTypes } from "./TaskRequestV1";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface IScheduleProps {
  schedule: IScheduleTypes;
  setSchedule: Dispatch<SetStateAction<IScheduleTypes>>;
  scheduleType: string;
  setScheduleType: Dispatch<SetStateAction<string>>;
  action: string;
  setIsOpenScheduleModalV1: Dispatch<SetStateAction<string>>;
}

const Schedule: FC<IScheduleProps> = ({
  schedule,
  setSchedule,
  scheduleType,
  setScheduleType,
  action,
  setIsOpenScheduleModalV1,
}) => {
  const FormSchema = z.object({
    schedule_type: z.string(),
    frequency_type: z.string(),
    frequency: z.coerce.number().min(1, "Frequency must be at least 1"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schedule_type: scheduleType ? scheduleType : "Periodic",
      frequency_type: schedule?.frequency_type
        ? schedule.frequency_type
        : "Minute(s)",
      frequency: schedule?.frequency ? schedule.frequency : 0,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSchedule({
      frequency_type: data.frequency_type,
      frequency: data.frequency,
    });
    setScheduleType(data.schedule_type);
    setIsOpenScheduleModalV1(""); // Close modal on submit
  };

  return (
    <div>
      {action === "Schedule" && (
        <div className="p-2 bg-slate-300 rounded-t mx-auto text-center font-bold flex justify-between">
          <h2>{action}</h2>
          <X
            onClick={() => setIsOpenScheduleModalV1("")}
            className="cursor-pointer"
          />
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
          <div className="flex justify-between">
            {/* Run Job Type Selection */}
            <FormField
              control={form.control}
              name="schedule_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                      required
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Periodic" />
                        </FormControl>
                        <FormLabel className="font-normal">Periodic</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem disabled value="On Specific Days" />
                        </FormControl>
                        <FormLabel className="font-normal text-gray-500">
                          On Specific Days
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Frequency & Frequency Type Selection */}
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        required
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frequency_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Month(s)">Month(s)</SelectItem>
                          <SelectItem value="Week(s)">Week(s)</SelectItem>
                          <SelectItem value="Day(s)">Day(s)</SelectItem>
                          <SelectItem value="Hour(s)">Hour(s)</SelectItem>
                          <SelectItem value="Minute(s)">Minute(s)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="fixed bottom-4 right-4 flex gap-2">
            <Button variant="secondary" type="submit">
              OK
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsOpenScheduleModalV1("")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Schedule;
