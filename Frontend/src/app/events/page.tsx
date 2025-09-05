import { EventsApi, EventDto } from "@/lib/api";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
  const { data: events } = await EventsApi.getEvents();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upcoming Events</h1>
      <a
        href="/events/create"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create Event
      </a>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((ev: EventDto) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}
