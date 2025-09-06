"use client";
import { useState } from "react";
import { EventsApi, EventDto } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EventForm() {
  const [form, setForm] = useState<EventDto>({
    name: "",
    location: "",
    startTime: "",
    endTime: "",
    maxCapacity: 0,
  });
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const router = useRouter();

  const timeZones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeZone(e.target.value);
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
      const get = (type: string) => parts.find(p => p.type === type)?.value || "";
      const tzDate = new Date(
        `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:00`
      );
      // Convert to UTC ISO string
      return new Date(tzDate.getTime() - tzDate.getTimezoneOffset() * 60000).toISOString();
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
      <input
        name="name"
        placeholder="Event Name"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="datetime-local"
        name="startTime"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="datetime-local"
        name="endTime"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <select
        name="timeZone"
        value={timeZone}
        onChange={handleTimeZoneChange}
        className="border p-2 w-full"
      >
        {timeZones.map(tz => (
          <option key={tz} value={tz}>{tz}</option>
        ))}
      </select>
      <input
        type="number"
        name="maxCapacity"
        placeholder="Max Capacity"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <div className="flex justify-center">
      <button type="submit" className="bg-blue-600 text-white p-2 w-9/12 flex justify-center rounded">
        Create Event
      </button>

      </div>
    </form>
  );
}
