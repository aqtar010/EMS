import Link from "next/link";
import { EventDto, EventsApi } from "@/lib/api";

export default function EventCard({ event,onDelete }: { event: EventDto,onDelete: () => void }) {

  const handleDelete = async () => {
    if (!event.id) return;
    await EventsApi.deleteEvent(event.id);
    onDelete();
  }
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{event.name}</h2>
      <p>{event.location}</p>
      <p>
        {new Date(event.startTime).toLocaleString()} -{" "}
        {new Date(event.endTime).toLocaleString()}
      </p>
      <p>Capacity: {event.maxCapacity}</p>
      <Link
        href={`/events/${event.id}`}
        className="text-blue-600 hover:underline"
      >
        View Details
      </Link>
      <button className="ml-4 bg-red-600 text-white p-2 rounded" onClick={handleDelete}>Delete Event</button>

    </div>
  );
}
