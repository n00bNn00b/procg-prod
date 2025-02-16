import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FC, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
const FormSchema = z.object({
  schedule_type: z.string(),
  schedule: z.union([
    z.object({
      frequency: z.number(),
      frequency_type: z.string(),
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
}
const OnceScheduleType: FC<IOnceScheduleType> = ({
  form,
}: IOnceScheduleType) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59
  const ampmOptions = ["AM", "PM"];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedAmPm, setSelectedAmPm] = useState<string>("AM");

  // Function to update the final datetime
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
      setSelectedDate(finalDate);
      form.setValue(
        "schedule.VALUES",
        String(format(finalDate, "MM/dd/yyyy hh:mm aa"))
        // String(finalDate)
      ); // Update form value
    }
  };
  return (
    <FormField
      control={form.control}
      name="schedule"
      render={() => (
        <FormItem className="flex flex-col">
          {/* <FormLabel>Select Date & Time</FormLabel> */}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-full flex justify-between"
                >
                  {selectedDate
                    ? format(selectedDate, "MM/dd/yyyy hh:mm aa")
                    : "Select date & time"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              {/* Calendar Date Picker */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  updateDateTime(
                    date,
                    selectedHour,
                    selectedMinute,
                    selectedAmPm
                  );
                }}
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
                    <SelectValue placeholder="Hour" />
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
                    <SelectValue placeholder="Minute" />
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
                    <SelectValue placeholder="AM/PM" />
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
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default OnceScheduleType;
