import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  IAsynchronousRequestsAndTaskSchedulesTypesV1,
  IScheduleOnce,
  ISchedulePropsNonPeriodic,
  ISchedulePropsPeriodic,
} from "@/types/interfaces/ARM.interface";
import OnceScheduleType from "./OnceScheduleType";
import { frequencyType, scheduler, dates, daysOfWeek } from "./NameValueData";

interface IScheduleProps {
  schedule:
    | ISchedulePropsPeriodic
    | ISchedulePropsNonPeriodic
    | IScheduleOnce
    | undefined;
  setSchedule: Dispatch<
    SetStateAction<
      | ISchedulePropsPeriodic
      | ISchedulePropsNonPeriodic
      | IScheduleOnce
      | undefined
    >
  >;
  scheduleType: string;
  setScheduleType: Dispatch<SetStateAction<string>>;
  action: string;
  setIsOpenScheduleModalV1: Dispatch<SetStateAction<string>>;
  selected?: IAsynchronousRequestsAndTaskSchedulesTypesV1;
  periodic: ISchedulePropsPeriodic | undefined;
  setPeriodic: Dispatch<SetStateAction<ISchedulePropsPeriodic | undefined>>;
}

const Schedule: FC<IScheduleProps> = ({
  schedule,
  setSchedule,
  scheduleType,
  setScheduleType,
  action,
  setIsOpenScheduleModalV1,
  selected,
}) => {
  const [scheduleHere, setScheduleHere] = useState<
    | ISchedulePropsPeriodic
    | ISchedulePropsNonPeriodic
    | IScheduleOnce
    | undefined
  >();

  const [frequency, setFrequency] = useState<number>();
  const [frequency_type, setFrequency_type] = useState<string>();
  const FormSchema = z.object({
    schedule_type: z.string(),
    schedule: z
      .union([
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
      ])
      .optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schedule_type:
        selected?.schedule_type ?? scheduleType !== ""
          ? scheduleType
          : "IMMEDIATE",
      schedule,
    },
  });

  useEffect(() => {
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 1);
    const parse = format(currentTime, "yyyy-MM-dd HH:mm");

    if (scheduleType === "" || scheduleType === "IMMEDIATE") {
      form.reset({ schedule_type: scheduleType, schedule: undefined });
      setScheduleType("IMMEDIATE");
      setScheduleHere(undefined);
    } else {
      setScheduleHere(() => {
        if (selected) {
          if (selected.schedule_type === scheduleType) {
            return selected.schedule;
          } else if (scheduleType === "PERIODIC") {
            return {} as ISchedulePropsPeriodic;
          } else if (scheduleType === "ONCE") {
            return { VALUES: parse };
          } else if (scheduleType === "WEEKLY_SPECIFIC_DAYS") {
            form.reset({
              schedule_type: scheduleType,
              schedule: selected.schedule ?? undefined,
            });
            return { VALUES: [] };
          } else if (scheduleType === "MONTHLY_SPECIFIC_DATES") {
            form.reset({
              schedule_type: scheduleType,
              schedule: selected.schedule ?? undefined,
            });
            return { VALUES: [] };
          }
        } else {
          if (scheduleType === "PERIODIC") {
            return {} as ISchedulePropsPeriodic;
          } else if (scheduleType === "ONCE") {
            return { VALUES: parse };
          } else if (scheduleType === "WEEKLY_SPECIFIC_DAYS") {
            form.reset({ schedule_type: scheduleType, schedule: undefined });
            return { VALUES: [] };
          } else if (scheduleType === "MONTHLY_SPECIFIC_DATES") {
            form.reset({ schedule_type: scheduleType, schedule: undefined });
            return { VALUES: [] };
          }
        }
      });
    }
  }, [scheduleType]);

  // Sequence Records
  const sequenceRecords = (items: string[]) => {
    const weekOrder =
      scheduleType === "WEEKLY_SPECIFIC_DAYS"
        ? daysOfWeek.map((day) => day.value)
        : dates.map((day) => day.value);

    const sortedDays = items.sort(
      (a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b)
    );

    form.setValue("schedule", {
      VALUES: sortedDays,
    });
    return sortedDays;
  };
  // Date and Time selections
  const handleDateSelect = (time: string) => {
    if (scheduleHere && "VALUES" in scheduleHere) {
      if (Array.isArray(scheduleHere.VALUES)) {
        {
          scheduleHere.VALUES.includes(time)
            ? setScheduleHere({
                VALUES: sequenceRecords(
                  scheduleHere.VALUES.filter((d) => d !== time)
                ),
              })
            : setScheduleHere({
                VALUES: sequenceRecords([...scheduleHere.VALUES, time]),
              });
        }
      }
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (scheduleType !== "IMMEDIATE") {
      if (!data.schedule) {
        return;
      }
    }
    try {
      setSchedule(
        scheduleType === "IMMEDIATE"
          ? ({} as ISchedulePropsPeriodic)
          : data.schedule
      );
      setScheduleType(data.schedule_type);
      setIsOpenScheduleModalV1("");
    } catch (error) {
      console.log(error);
    }
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
                      {scheduler.map((s) => (
                        <FormItem
                          key={s.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={s.value}
                              onClick={() => setScheduleType(s.value)}
                            />
                          </FormControl>
                          <FormLabel className={`font-normal`}>
                            {s.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Frequency & Frequency Type Selection */}
            {form.getValues().schedule_type === "PERIODIC" ? (
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="schedule.FREQUENCY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          type="number"
                          min={1}
                          value={field.value ?? 0}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            setFrequency(e.target.valueAsNumber);
                            form.setValue("schedule", {
                              FREQUENCY: e.target.valueAsNumber,
                              FREQUENCY_TYPE: frequency_type ?? "MINUTES",
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schedule.FREQUENCY_TYPE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setFrequency_type(value);
                            form.setValue("schedule", {
                              FREQUENCY: frequency ?? 1,
                              FREQUENCY_TYPE: value,
                            });
                          }}
                          value={field.value}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a option" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyType.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : form.getValues().schedule_type === "MONTHLY_SPECIFIC_DATES" ? (
              <div>
                <h3>Dates of Every Month:</h3>
                <div className="grid grid-cols-7 py-2">
                  {dates.map((date) => (
                    <div
                      key={date.value}
                      className={`${
                        scheduleHere &&
                        "VALUES" in scheduleHere &&
                        Array.isArray(scheduleHere.VALUES) &&
                        scheduleHere.VALUES.includes(date.value) &&
                        "bg-slate-400"
                      } text-center border border-slate-500 rounded cursor-pointer hover:bg-slate-200 p-2 ${
                        date.value === "L" && "col-span-4"
                      }`}
                      onClick={() => {
                        handleDateSelect(date.value);
                      }}
                    >
                      {date.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : form.getValues().schedule_type === "WEEKLY_SPECIFIC_DAYS" ? (
              <div>
                <div>
                  <h3>Days of Every Week:</h3>
                  <div className="grid grid-cols-7 py-2">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day.value}
                        className={`${
                          scheduleHere &&
                          "VALUES" in scheduleHere &&
                          Array.isArray(scheduleHere.VALUES) &&
                          scheduleHere.VALUES.includes(day.value) &&
                          "bg-slate-400"
                        } flex items-center justify-center h-8 border border-slate-500 rounded cursor-pointer hover:bg-slate-200 p-2`}
                        onClick={() => handleDateSelect(day.value)}
                      >
                        {day.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              form.getValues().schedule_type === "ONCE" && (
                <OnceScheduleType
                  form={form}
                  setScheduleHere={setScheduleHere}
                />
              )
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
