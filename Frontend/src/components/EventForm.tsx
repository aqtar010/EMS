"use client";
import { useState } from "react";
import { EventsApi, EventDto } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { DateTimePicker } from "./ui/dateTime";
import SelectTimezoneWrapper from "./MicroComponents/SelectWrapper";

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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toLocalDateTimeString = (date: Date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd HH:mm");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      <Input
        name="name"
        placeholder="Event Name"
        onChange={handleChange}
        className="border p-2 w-full bg-neutral placeholder-white"
      />
      <Input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <DateTimePicker
        onChange={(date) => {
          form.startTime = date;
        }}
        className="border bg-neutral p-2 w-full"
      />
      <DateTimePicker
        className="border bg-neutral p-2 w-full "
        onChange={(date) => {
          form.endTime = date;
        }}
      />
      <SelectTimezoneWrapper setTimeZone={setTimeZone}/>


      <Input
        type="number"
        name="maxCapacity"
        placeholder="Max Capacity"
        onChange={handleChange}
        className="border p-2 w-full"
      />
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
