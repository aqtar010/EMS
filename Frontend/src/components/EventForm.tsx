"use client";
import { useState } from "react";
import { EventsApi, EventDto } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DateTimePicker } from "./ui/dateTime";

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



  const toUtcIso = (local: string, tz: string) => {
    if (!local) return "";
    // local: "YYYY-MM-DDTHH:mm"
    const [datePart, timePart] = local.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Create date in selected time zone
    const zonedDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    // Get offset in minutes for the selected time zone
    try {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const parts = fmt.formatToParts(zonedDate);
      const get = (type: string) =>
        parts.find((p) => p.type === type)?.value || "";
      const tzDate = new Date(
        `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get(
          "minute"
        )}:00`
      );
      // Convert to UTC ISO string
      return new Date(
        tzDate.getTime() - tzDate.getTimezoneOffset() * 60000
      ).toISOString();
    } catch {
      // fallback to local
      return zonedDate.toISOString();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: EventDto & { timeZone: string } = {
      ...form,
      startTime: toUtcIso(form.startTime as string, timeZone),
      endTime: toUtcIso(form.endTime as string, timeZone),
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
        className="border p-2 w-full placeholder-white"
      />
      <Input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        className="border p-2 w-full"
      />
       <DateTimePicker
      onChange={(date) =>{form.startTime=date} }
      className="border bg-neutral p-2 w-full"
      />
      <DateTimePicker
      
      className="border bg-neutral p-2 w-full "
      onChange={(date) =>{form.endTime=date} }
      />

      <Select onValueChange={(value) => setTimeZone(value)} >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Africa</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
            <SelectItem value="west">
              Western European Summer Time (WEST)
            </SelectItem>
            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
            <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
            <SelectItem value="ist_indonesia">
              Indonesia Central Standard Time (WITA)
            </SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Australia & Pacific</SelectLabel>
            <SelectItem value="awst">
              Australian Western Standard Time (AWST)
            </SelectItem>
            <SelectItem value="acst">
              Australian Central Standard Time (ACST)
            </SelectItem>
            <SelectItem value="aest">
              Australian Eastern Standard Time (AEST)
            </SelectItem>
            <SelectItem value="nzst">
              New Zealand Standard Time (NZST)
            </SelectItem>
            <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value="art">Argentina Time (ART)</SelectItem>
            <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
            <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
            <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
