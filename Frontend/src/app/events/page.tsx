"use client";
import { useEffect, useState } from "react";
import { EventsApi, EventDto } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDto[]>([]);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await EventsApi.getEvents();
    setEvents(data);
  };

  const handleDelete = async () => {
    await fetchEvents(); // Re-fetch events after deletion
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upcoming Events</h1>
      <Link
        href="/events/create"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create Event
      </Link>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((ev: EventDto) => (
          <EventCard key={ev.id} onDelete={handleDelete} event={ev} />
        ))}
      </div>
    </div>
  );
}
