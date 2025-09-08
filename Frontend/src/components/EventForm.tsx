"use client";
import { useState } from "react";
import { EventsApi, EventDto } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { DateTimePicker } from "./ui/dateTime";
import SelectTimezoneWrapper from "./MicroComponents/SelectWrapper";
import { isAfter, isValid } from "date-fns";

export default function EventForm() {
  const [form, setForm] = useState<EventDto>({
    name: "",
    location: "",
    startTime: "",
    endTime: "",
    maxCapacity: 0,
  });
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "maxCapacity" ? parseInt(value) || 0 : value,
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Event name is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.startTime || !isValid(form.startTime as Date))
      newErrors.startTime = "Valid start time is required.";
    if (!form.endTime || !isValid(form.endTime as Date))
      newErrors.endTime = "Valid end time is required.";
    if (
      form.startTime &&
      form.endTime &&
      isValid(form.startTime as Date) &&
      isValid(form.endTime as Date) &&
      !isAfter(form.endTime as Date, form.startTime as Date)
    ) {
      newErrors.endTime = "End time must be after start time.";
    }
    if (!form.maxCapacity || form.maxCapacity <= 0)
      newErrors.maxCapacity = "Max capacity must be a positive number.";
    if (!timeZone.trim()) newErrors.timeZone = "Time zone is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toLocalDateTimeString = (date: Date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd HH:mm");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload: EventDto & { timeZone: string } = {
      ...form,
      startTime: toLocalDateTimeString(form.startTime as Date),
      endTime: toLocalDateTimeString(form.endTime as Date),
      timeZone: timeZone,
    };

    await EventsApi.createEvent(payload);
    router.push("/events");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div className="max-h-[3rem] pb-4">
        <Input
          name="name"
          placeholder="Event Name"
          autoComplete="off"
          onChange={handleChange}
          className="border p-2 w-full bg-neutral m-0 placeholder-white"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div className="max-h-[3rem] pb-4">
        <Input
          name="location"
          placeholder="Location"
          autoComplete="off"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}
      </div>
      <div className="max-h-[3rem] pb-4">
        <DateTimePicker
          onChange={(date) => {
            setForm({ ...form, startTime: date });
          }}
          className="border bg-neutral p-2 w-full"
        />
        {errors.startTime && (
          <p className="text-red-500 text-sm">{errors.startTime}</p>
        )}
      </div>
      <div className="max-h-[3rem] pb-4">
        <DateTimePicker
          className="border bg-neutral p-2 w-full "
          onChange={(date) => {
            setForm({ ...form, endTime: date });
          }}
        />
        {errors.endTime && (
          <p className="text-red-500 text-sm">{errors.endTime}</p>
        )}
      </div>
      <div className="max-h-[3rem] pb-4">
        <SelectTimezoneWrapper setTimeZone={setTimeZone} />
        {errors.timeZone && (
          <p className="text-red-500 text-sm">{errors.timeZone}</p>
        )}
      </div>

      <div className="max-h-[3rem] pb-4">
        <Input
          type="number"
          name="maxCapacity"
          placeholder="Max Capacity"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {errors.maxCapacity && (
          <p className="text-red-500 text-sm">{errors.maxCapacity}</p>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          className="p-2 w-9/12 flex justify-center rounded"
        >
          Create Event
        </Button>
      </div>
    </form>
  );
}
