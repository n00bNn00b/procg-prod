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
import { IAsynchronousRequestsAndTaskSchedulesTypesV1 } from "@/types/interfaces/ARM.interface";
const date = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
interface IScheduleProps {
  schedule: IScheduleTypes;
  setSchedule: Dispatch<SetStateAction<IScheduleTypes>>;
  scheduleType: string;
  setScheduleType: Dispatch<SetStateAction<string>>;
  action: string;
  setIsOpenScheduleModalV1: Dispatch<SetStateAction<string>>;
  selected?: IAsynchronousRequestsAndTaskSchedulesTypesV1;
  selectedDates: number[];
  setSelectedDates: Dispatch<SetStateAction<number[]>>;
  selectedDays: string[];
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
}

const Schedule: FC<IScheduleProps> = ({
  schedule,
  setSchedule,
  scheduleType,
  setScheduleType,
  action,
  setIsOpenScheduleModalV1,
  selected,
  selectedDates,
  setSelectedDates,
  selectedDays,
  setSelectedDays,
}) => {
  const FormSchema = z.object({
    schedule_type: z.string(),
    schedule:
      scheduleType === "Periodic"
        ? z.object({
            frequency: z.coerce.number().min(1, "Frequency must be at least 1"),
            frequency_type: z.string(),
          })
        : z.object({
            days_of_month: z.number().array().optional(),
            days_of_week: z.string().array().optional(),
          }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schedule_type: selected?.schedule_type ?? scheduleType ?? "Periodic",
      schedule: selected?.schedule ?? schedule,
    },
  });

  const handleDateSelect = (time: number | string) => {
    if (typeof time === "number") {
      setSelectedDays([]);
      setSelectedDates(
        selectedDates.includes(time)
          ? selectedDates.filter((d) => d !== time)
          : [...selectedDates, time]
      );
      setSchedule({ days_of_month: [...selectedDates, time] });
      form.setValue(
        "schedule.days_of_month",
        selectedDates.includes(time)
          ? selectedDates.filter((d) => d !== time)
          : [...selectedDates, time]
      );
    } else {
      setSelectedDates([]);
      setSelectedDays(
        selectedDays.includes(time)
          ? selectedDays.filter((d) => d !== time)
          : [...selectedDays, time]
      );
      setSchedule({ days_of_week: [...selectedDays, time] });
      form.setValue(
        "schedule.days_of_week",
        selectedDays.includes(time)
          ? selectedDays.filter((d) => d !== time)
          : [...selectedDays, time]
      );
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    try {
      setSchedule(
        selectedDates.length > 0
          ? { days_of_month: selectedDates }
          : { days_of_week: selectedDays }
      );
      setScheduleType(data.schedule_type);
      setIsOpenScheduleModalV1("");
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   if (selected?.schedule.days_of_month) {
  //     setSelectedDates(selected?.schedule.days_of_month);
  //   } else if (selected?.schedule.days_of_week) {
  //     setSelectedDays(selected?.schedule.days_of_week);
  //   }
  // }, []);
  // console.log(selectedDates, "lll1");
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
                          <RadioGroupItem
                            onClick={() => setScheduleType("Periodic")}
                            value="Periodic"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Periodic</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            onClick={() => setScheduleType("on_specific_days")}
                            value="on_specific_days"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
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
            {form.getValues().schedule_type === "Periodic" ? (
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="schedule.frequency"
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
                  name="schedule.frequency_type"
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
            ) : (
              <div>
                <div>
                  <h3>Dates of Every Month:</h3>
                  <div className="grid grid-cols-7 py-2">
                    {date.map((day) => (
                      <div
                        key={day}
                        className={`${
                          selectedDates.includes(day) && "bg-slate-400"
                        } flex items-center justify-center h-8 border border-slate-500 rounded cursor-pointer hover:bg-slate-200 p-2`}
                        onClick={() => handleDateSelect(day)}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Days of Every Week:</h3>
                  <div className="grid grid-cols-7 py-2">
                    {daysOfWeek.map((day, i) => (
                      <div
                        key={i}
                        className={`${
                          selectedDays.includes(day) && "bg-slate-400"
                        } flex items-center justify-center h-8 border border-slate-500 rounded cursor-pointer hover:bg-slate-200 p-2`}
                        onClick={() => handleDateSelect(day)}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
