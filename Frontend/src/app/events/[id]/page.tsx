"use client";
import { useEffect, useState } from "react";
import { EventsApi, EventDto, AttendeeDto } from "@/lib/api";
import AttendeeForm from "@/components/AttendeeForm";
import React from "react";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [eventData, setEventData] = useState<EventDto | null>(null);
  const [attendees, setAttendees] = useState<AttendeeDto[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data: events } = await EventsApi.getEvents();
      const found = events.find((e: EventDto) => e.id?.toString() === id);
      setEventData(found || null);
    };
    const fetchAttendees = async () => {
      const attendeesRes = await EventsApi.getAttendees(id, page, pageSize);
      console.log(attendeesRes.data);
      setAttendees(attendeesRes.data.attendees ?? []);
      setTotal(attendeesRes.data.totalAttendees || 0);
    };
    fetchEvent();
    fetchAttendees();
  }, [id, page]);

  const handleRegister = async (attendee: AttendeeDto) => {
    try {
      await EventsApi.registerAttendee(id, attendee);
      // Refresh attendee list after registration
      const attendeesRes = await EventsApi.getAttendees(id, page, pageSize);
      setAttendees(attendeesRes.data.attendees);
      setTotal(attendeesRes.data.totalAttendees|| 0);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response?.status === "number" &&
        (error as { response: { status: number } }).response.status === 409
      ) {
        setShowPopup(true);
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  if (!eventData) return <div>Event not found</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{eventData.name}</h1>
      <p>{eventData.location}</p>
      <p>
        {new Date(eventData.startTime).toLocaleString()} -{" "}
        {new Date(eventData.endTime).toLocaleString()}
      </p>
      <p>Capacity: {eventData.maxCapacity}</p>

      <h2 className="text-xl font-semibold mt-6">Register</h2>
      <AttendeeForm eventId={id} onRegister={handleRegister} />

      <h2 className="text-xl font-semibold mt-6">Attendees</h2>
      <ul className="list-disc pl-5">
        {attendees.map((att: AttendeeDto) => (
          <li style={{ color: "white" }} key={att.id}>
            {att.name} ({att.email})
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          <button
            className="px-2 py-1 bg-gray-700 text-white rounded"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span className="text-white">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-2 py-1 bg-gray-700 text-white rounded"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow text-black">
            <p>Max capacity reached. You cannot register more attendees.</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
