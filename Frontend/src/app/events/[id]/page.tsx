"use client";
import { useEffect, useState } from "react";
import { EventsApi, EventDto, AttendeeDto } from "@/lib/api";
import AttendeeForm from "@/components/AttendeeForm";
import AttendeeList from "@/components/AttendeeList";
import React from "react";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [eventData, setEventData] = useState<EventDto | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data: events } = await EventsApi.getEvents();
      const found = events.find((e: EventDto) => e.id?.toString() === id);
      setEventData(found || null);
    };
    refreshAttendees(); // Initial fetch of attendees
    fetchEvent();
  }, [id]);

  // This function will be passed to AttendeeList and called to trigger a refresh
  const refreshAttendees = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  const handleRegister = async (attendee: AttendeeDto) => {
    try {
      await EventsApi.registerAttendee(id, attendee);
      refreshAttendees(); // Trigger attendee list refresh in child
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

      <AttendeeList EventId={id} refreshFlag={refreshFlag} />

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
