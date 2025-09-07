"use client";
import { useCallback, useEffect, useState } from "react";
import { EventsApi, EventDto } from "@/lib/api";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SelectTimezoneWrapper from "@/components/MicroComponents/SelectWrapper";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [queryTimezone, setQueryTimezone] = useState<string>("Asia/Kolkata");
  const router = useRouter();

  // Fetch events on mount
  const fetchEvents = useCallback(async () => {
    const { data } = await EventsApi.getEvents(queryTimezone);
    setEvents(data);
  }, [queryTimezone]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async () => {
    await fetchEvents();
  };

  function handleSetTimezone(value: string): void {
    setQueryTimezone(value);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome to EMS</h1>
        <Button onClick={() => router.push("/events/create")}>
          {" "}
          Create Event
        </Button>
      </div>
      <div className="flex flex-row justify-between">
        <div>
          <h6>Your Own Event Mangement System!</h6>
          <p>
            {" "}
            Create ,Delete Events and Add attendees to keep track of your
            events!
          </p>
        </div>
        <div className="w-100">
          <SelectTimezoneWrapper setTimeZone={handleSetTimezone} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {events.map((ev: EventDto) => (
          <EventCard key={ev.id} onDelete={handleDelete} event={ev} />
        ))}
      </div>
    </div>
  );
}
