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
  schedule: z
    .union([
      z.object({ FREQUENCY: z.number(), FREQUENCY_TYPE: z.string() }),
      z.object({ VALUES: z.array(z.string()) }),
      z.object({ VALUES: z.string(z.date()) }),
    ])
    .optional(),
});

interface IOnceScheduleType {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
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
  setScheduleHere,
}: IOnceScheduleType) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 (24-hour format)
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59

  // Get the current time and add one minute
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + 1);

  // Default time based on current time plus 1 minute
  const defaultHour = currentTime.getHours(); // 24-hour format
  const defaultMinute = currentTime.getMinutes();
  const defaultDate = currentTime;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultDate
  );
  const [selectedHour, setSelectedHour] = useState<number>(defaultHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(defaultMinute);

  // Use effect to set initial values on load (in case form already has a value)
  useEffect(() => {
    const formValue = form.getValues("schedule.VALUES");
    if (typeof formValue === "string") {
      const dateObj = new Date(formValue);
      setSelectedDate(dateObj);
      setSelectedHour(dateObj.getHours());
      setSelectedMinute(dateObj.getMinutes());
    }

    form.setValue("schedule", {
      VALUES: format(currentTime, "yyyy-MM-dd HH:mm"),
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
    };
  };

  const { currentHour, currentMinute } = getCurrentTime();

  const handleDateSelect = (date: Date | undefined) => {
    if (date && date >= getToday()) {
      // Adjust selected time based on user selection (selectedHour, selectedMinute)
      const updatedDate = new Date(date);
      updatedDate.setHours(selectedHour);
      updatedDate.setMinutes(selectedMinute);

      // Update form value with formatted date and time
      form.setValue("schedule", {
        VALUES: format(updatedDate, "yyyy-MM-dd HH:mm"),
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
    minute: number
  ) => {
    if (date) {
      const finalDate = new Date(date);
      finalDate.setHours(hour, minute, 0);

      // Check if the selected time is in the past
      if (finalDate < new Date()) {
        // If time is in the past, set to tomorrow's date and set to current time
        const tomorrow = getTomorrow();
        finalDate.setDate(tomorrow.getDate());
        finalDate.setHours(currentHour, currentMinute, 0); // Set the time to current time

        toast({
          title: "Time Adjusted",
          description:
            "The time was in the past, so the date has been moved to tomorrow and the time adjusted.",
        });
      }

      setSelectedDate(finalDate);
      setScheduleHere({
        VALUES: String(format(finalDate, "yyyy-MM-dd HH:mm")),
      });
      // Update the form value with formatted date
      form.setValue("schedule", {
        VALUES: format(finalDate, "yyyy-MM-dd HH:mm"),
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name="schedule"
      render={() => (
        <FormItem className="flex flex-col items-center">
          {/* Calendar Date Picker */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />

          {/* Time Picker - Hour, Minute */}
          <div className="flex justify-between mt-2 gap-2">
            {/* Hour Selection */}
            <Select
              onValueChange={(value) => {
                const hour = parseInt(value);
                setSelectedHour(hour);
                updateDateTime(selectedDate, hour, selectedMinute);
              }}
              value={selectedHour.toString()}
            >
              <SelectTrigger className="w-24">
                <SelectValue>
                  {selectedHour.toString().padStart(2, "0")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Minute Selection */}
            <Select
              onValueChange={(value) => {
                const minute = parseInt(value);
                setSelectedMinute(minute);
                updateDateTime(selectedDate, selectedHour, minute);
              }}
              value={selectedMinute.toString()}
            >
              <SelectTrigger className="w-24">
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
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OnceScheduleType;
