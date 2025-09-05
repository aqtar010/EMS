import Link from "next/link";
import { EventDto } from "@/lib/api";

export default function EventCard({ event }: { event: EventDto }) {
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
    </div>
  );
}
