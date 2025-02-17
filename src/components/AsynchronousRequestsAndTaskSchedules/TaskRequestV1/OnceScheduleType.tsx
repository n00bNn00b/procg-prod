import { format } from "date-fns";
import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  IScheduleOnce,
  ISchedulePropsNonPeriodic,
  ISchedulePropsPeriodic,
} from "@/types/interfaces/ARM.interface";
import { toast } from "@/components/ui/use-toast";

// Validation schema using zod
const FormSchema = z.object({
  schedule_type: z.string(),
  schedule: z.union([
    z.object({
      FREQUENCY: z.number(),
      FREQUENCY_TYPE: z.string(),
    }),
    z.object({
      VALUES: z.array(z.string()),
    }),
    z.object({
      VALUES: z.string(z.date()),
    }),
  ]),
});

interface IOnceScheduleType {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  scheduleHere:
    | ISchedulePropsPeriodic
    | ISchedulePropsNonPeriodic
    | IScheduleOnce
    | undefined;
  setScheduleHere: Dispatch<
    SetStateAction<
      | ISchedulePropsPeriodic
      | ISchedulePropsNonPeriodic
      | IScheduleOnce
      | undefined
    >
  >;
}

const OnceScheduleType: FC<IOnceScheduleType> = ({
  form,
  // scheduleHere,
  setScheduleHere,
}: IOnceScheduleType) => {
  // Default string value
  // const defaultDateString =
  //   schedule && "VALUES" in schedule && schedule.VALUES
  //     ? String(schedule.VALUES) // Ensure it's a string
  //     : "";

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59
  const ampmOptions = ["AM", "PM"];

  // Get the current time and add one minute
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + 1);
  console.log(currentTime, "current time");
  // Default time based on current time plus 1 minute
  const defaultHour = currentTime.getHours() % 12 || 12; // 12-hour format
  const defaultMinute = currentTime.getMinutes();
  const defaultAmPm = currentTime.getHours() >= 12 ? "PM" : "AM";
  const defaultDate = currentTime;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultDate
  );
  const [selectedHour, setSelectedHour] = useState<number>(defaultHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(defaultMinute);
  const [selectedAmPm, setSelectedAmPm] = useState<string>(defaultAmPm);

  // Use effect to set initial values on load (in case form already has a value)
  useEffect(() => {
    const formValue = form.getValues("schedule.VALUES");
    if (typeof formValue === "string") {
      const dateObj = new Date(formValue); // This should be a valid date string
      setSelectedDate(dateObj);
      setSelectedHour(dateObj.getHours() % 12); // 12-hour format
      setSelectedMinute(dateObj.getMinutes());
      setSelectedAmPm(dateObj.getHours() >= 12 ? "PM" : "AM");
    }
    form.setValue("schedule", {
      VALUES: format(currentTime, "MM/dd/yyyy hh:mm aa"),
    });
  }, [form]);

  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    return today;
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    return tomorrow;
  };

  // Get current time for comparison
  const getCurrentTime = () => {
    const now = new Date();
    return {
      currentHour: now.getHours(),
      currentMinute: now.getMinutes(),
      currentAmPm: now.getHours() >= 12 ? "PM" : "AM",
    };
  };

  const { currentHour, currentMinute } = getCurrentTime();

  const handleDateSelect = (date: Date | undefined) => {
    if (date && date >= getToday()) {
      // Adjust selected time based on user selection (selectedHour, selectedMinute, selectedAmPm)
      const updatedDate = new Date(date);
      const hours =
        selectedAmPm === "AM" ? selectedHour % 12 : (selectedHour % 12) + 12;
      updatedDate.setHours(hours);
      updatedDate.setMinutes(selectedMinute);

      // Update form value with formatted date and time
      form.setValue("schedule", {
        VALUES: format(updatedDate, "MM/dd/yyyy hh:mm aa"),
      });

      // Set selected date in the state
      setSelectedDate(updatedDate);
    } else {
      toast({
        title: "Invalid Date",
        description: "Please select a date today or in the future.",
        variant: "destructive",
      });
    }
  };

  // Update date and time when changes happen
  const updateDateTime = (
    date: Date | null | undefined,
    hour: number,
    minute: number,
    ampm: string
  ) => {
    if (date) {
      const finalDate = new Date(date);
      let finalHour = ampm === "PM" && hour !== 12 ? hour + 12 : hour;
      if (ampm === "AM" && hour === 12) finalHour = 0;
      finalDate.setHours(finalHour, minute, 0);

      // Check if the selected time is in the past
      if (finalDate < new Date()) {
        // If time is in the past, set to tomorrow's date and set to current time
        const tomorrow = getTomorrow();
        finalDate.setDate(tomorrow.getDate());
        finalDate.setHours(currentHour, currentMinute, 0); // Set the time to current time

        // Set selected time to tomorrow and correct AM/PM
        const adjustedAmPm = finalDate.getHours() >= 12 ? "PM" : "AM";
        setSelectedAmPm(adjustedAmPm);
        toast({
          title: "Time Adjusted",
          description:
            "The time was in the past, so the date has been moved to tomorrow and the time adjusted.",
        });
      }

      setSelectedDate(finalDate);
      setScheduleHere({
        VALUES: String(format(finalDate, "MM/dd/yyyy hh:mm aa")),
      });
      // Update the form value with formatted date
      form.setValue("schedule", {
        VALUES: format(finalDate, "MM/dd/yyyy hh:mm aa"),
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name="schedule"
      render={() => (
        <FormItem className="flex flex-col">
          {/* Calendar Date Picker */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          {/* Time Picker - Hour, Minute, AM/PM */}
          <div className="flex justify-between mt-2 gap-2">
            {/* Hour Selection */}
            <Select
              onValueChange={(value) => {
                const hour = parseInt(value);
                setSelectedHour(hour);
                updateDateTime(
                  selectedDate,
                  hour,
                  selectedMinute,
                  selectedAmPm
                );
              }}
              value={selectedHour.toString()}
            >
              <SelectTrigger>
                <SelectValue>{selectedHour.toString()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Minute Selection */}
            <Select
              onValueChange={(value) => {
                const minute = parseInt(value);
                setSelectedMinute(minute);
                updateDateTime(
                  selectedDate,
                  selectedHour,
                  minute,
                  selectedAmPm
                );
              }}
              value={selectedMinute.toString()}
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedMinute.toString().padStart(2, "0")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* AM/PM Selection */}
            <Select
              onValueChange={(value) => {
                setSelectedAmPm(value);
                updateDateTime(
                  selectedDate,
                  selectedHour,
                  selectedMinute,
                  value
                );
              }}
              value={selectedAmPm}
            >
              <SelectTrigger>
                <SelectValue>{selectedAmPm}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ampmOptions.map((ampm) => (
                  <SelectItem key={ampm} value={ampm}>
                    {ampm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OnceScheduleType;
