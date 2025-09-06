import Link from "next/link";
import { EventDto, EventsApi } from "@/lib/api";

export default function EventCard({ event,onDelete }: { event: EventDto,onDelete: () => void }) {

  const handleDelete = async () => {
    if (!event.id) return;
    await EventsApi.deleteEvent(event.id);
    onDelete();
  }
  return (
    <div className=" bg-gray-50/25 backdrop-blur-md p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{event.name}</h2>
      <p>Location : {event.location}</p>
      <p> Schedule : 
        {new Date(event.startTime).toLocaleString()} -{" "}
        {new Date(event.endTime).toLocaleString()}
      </p>
      <p>Capacity : {event.maxCapacity}</p>
      <div className="mt-4 flex justify-between items-center m-1">
      <Link
        href={`/events/${event.id}`}
        className="text-blue-600 hover:underline"
      >
        View Details
      </Link>
      <button className="ml-4 bg-red-600 text-white p-2 rounded" onClick={handleDelete}>Delete Event</button>

      </div>

    </div>
  );
}
