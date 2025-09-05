"use client";
import { useEffect, useState } from "react";
import { EventsApi, EventDto, AttendeeDto } from "@/lib/api";
import AttendeeForm from "@/components/AttendeeForm";
import React from "react";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [eventData, setEventData] = useState<EventDto | null>(null);
  const [attendees, setAttendees] = useState<AttendeeDto[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data: events } = await EventsApi.getEvents();
      const found = events.find((e: EventDto) => e.id?.toString() === id);
      setEventData(found || null);
    };
    const fetchAttendees = async () => {
      const attendeesRes = await EventsApi.getAttendees(id);
      setAttendees(attendeesRes.data.items);
    };
    fetchEvent();
    fetchAttendees();
  }, [id]);

  const handleRegister = async (attendee: AttendeeDto) => {
    await EventsApi.registerAttendee(id, attendee);
    // Refresh attendee list after registration
    const attendeesRes = await EventsApi.getAttendees(id);
    setAttendees(attendeesRes.data.items);
  };

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
    </div>
  );
}
