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
const dates = [
  { name: "1", value: "1" },
  { name: "2", value: "2" },
  { name: "3", value: "3" },
  { name: "4", value: "4" },
  { name: "5", value: "5" },
  { name: "6", value: "6" },
  { name: "7", value: "7" },
  { name: "8", value: "8" },
  { name: "9", value: "9" },
  { name: "10", value: "10" },
  { name: "11", value: "11" },
  { name: "12", value: "12" },
  { name: "13", value: "13" },
  { name: "14", value: "14" },
  { name: "15", value: "15" },
  { name: "16", value: "16" },
  { name: "17", value: "17" },
  { name: "18", value: "18" },
  { name: "19", value: "19" },
  { name: "20", value: "20" },
  { name: "21", value: "21" },
  { name: "22", value: "22" },
  { name: "23", value: "23" },
  { name: "24", value: "24" },
  { name: "25", value: "25" },
  { name: "26", value: "26" },
  { name: "27", value: "27" },
  { name: "28", value: "28" },
  { name: "29", value: "29" },
  { name: "30", value: "30" },
  { name: "31", value: "31" },
  { name: "Last Day", value: "L" },
];
const daysOfWeek = [
  { name: "Sun", value: "SUN" },
  { name: "Mon", value: "MON" },
  { name: "Tue", value: "TUE" },
  { name: "Wed", value: "WED" },
  { name: "Thu", value: "THU" },
  { name: "Fri", value: "FRI" },
  { name: "Sat", value: "SAT" },
];
interface IScheduleProps {
  schedule: IScheduleTypes;
  setSchedule: Dispatch<SetStateAction<IScheduleTypes>>;
  scheduleType: string;
  setScheduleType: Dispatch<SetStateAction<string>>;
  action: string;
  setIsOpenScheduleModalV1: Dispatch<SetStateAction<string>>;
  selected?: IAsynchronousRequestsAndTaskSchedulesTypesV1;
  selectedDates: string[];
  setSelectedDates: Dispatch<SetStateAction<string[]>>;
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
            days_of_month: z.string().array().optional(),
            days_of_week: z.string().array().optional(),
          }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schedule_type: selected?.schedule_type ?? "Periodic",
      schedule: selected?.schedule ?? schedule,
    },
  });

  const handleDateSelect = (time: string) => {
    if (time.length !== 3) {
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
          <div className="grid grid-cols-2 gap-4">
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
                    {dates.map((date) => (
                      <div
                        key={date.value}
                        className={`${
                          selectedDates.includes(date.value) && "bg-slate-400"
                        }  border border-slate-500 rounded cursor-pointer hover:bg-slate-200 p-2 ${
                          date.value === "L" && "col-span-4"
                        }`}
                        onClick={() => handleDateSelect(date.value)}
                      >
                        {date.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Days of Every Week:</h3>
                  <div className="grid grid-cols-7 py-2">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day.value}
                        className={`${
                          selectedDays.includes(day.value) && "bg-slate-400"
                        } flex items-center justify-center h-8 border border-slate-500 rounded cursor-pointer hover:bg-slate-200 p-2`}
                        onClick={() => handleDateSelect(day.value)}
                      >
                        {day.name}
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
