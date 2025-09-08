"use client";
import { useEffect, useState } from "react";
import { EventsApi, EventDto, AttendeeDto } from "@/lib/api";
import AttendeeForm from "@/components/AttendeeForm";
import AttendeeList from "@/components/AttendeeList";
import React from "react";
import BackButton from "@/components/MicroComponents/BackButton";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [eventData, setEventData] = useState<EventDto | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data: events } = await EventsApi.getEvents();
      const found = events.find((e: EventDto) => e.id?.toString() === id);
      setEventData(found || null);
    };
    fetchEvent();
  }, [id]);

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
        typeof (error as { response?: { status?: number } }).response
          ?.status === "number"
      ) {
        const status = (error as { response: { status: number } }).response
          .status;

        if (status === 403) {
          setPopupMessage(
            "Max capacity reached. You cannot register more attendees."
          );
        } else if (status === 409) {
          setPopupMessage(
            "Duplicate registration. This email is already registered."
          );
        } else {
          setPopupMessage("Something went wrong. Please try again.");
        }
        setShowPopup(true);
      } else {
        setPopupMessage("Unexpected error occurred.");
        setShowPopup(true);
      }
    }
  };

  if (!eventData) {
    return (
      <div className="text-center text-lg mt-10 text-gray-600">
        Event not found
      </div>
    );
  }

  return (
    <div>
      <BackButton/>
      <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50/30 backdrop-blur-md rounded-lg shadow-lg mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-700 mb-2">
              {eventData.name}
            </h1>
            <p className="text-600 mb-1">{eventData.location}</p>
            <p className="text-500 text-sm">
              {new Date(eventData.startTime).toLocaleString()} &mdash;{" "}
              {new Date(eventData.endTime).toLocaleString()}
            </p>
          </div>
          <div className="text-800 px-4 py-2 rounded-lg font-semibold text-center">
            Capacity: {eventData.maxCapacity}
          </div>
          <div className="text-800 px-4 py-2 rounded-lg font-semibold text-center">
            Attendees Count: {attendeesCount}
          </div>
        </div>

        <section className="rounded-lg p-6 shadow">
          <AttendeeForm eventId={id} onRegister={handleRegister} />
        </section>

        <section className=" rounded-lg h-80 shadow">
          <AttendeeList
            eventId={id}
            refreshFlag={refreshFlag}
            setAttendeesCount={setAttendeesCount}
          />
        </section>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <p className="text-lg text-red-600 font-semibold mb-4">
                {popupMessage}
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
