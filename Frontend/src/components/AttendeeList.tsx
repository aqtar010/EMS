"use client";
import { AttendeeDto, EventsApi } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AttendeeList({
  eventId,
  refreshFlag,
  setAttendeesCount,
}: {
  eventId: string;
  refreshFlag: number;
  setAttendeesCount?: (count: number) => void;
}) {
  const [attendees, setAttendees] = useState<AttendeeDto[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);
  useEffect(() => {
    const fetchAttendees = async () => {
      const attendeesRes = await EventsApi.getAttendees(
        eventId,
        page,
        pageSize
      );
      console.log(attendeesRes.data);
      setAttendees(attendeesRes.data.attendees ?? []);
      setTotal(attendeesRes.data.totalAttendees || 0);
    };
    fetchAttendees();
  }, [page, eventId, refreshFlag]);
  useEffect(() => {
    if (setAttendeesCount) {
      setAttendeesCount(total);
    }
  }, [setAttendeesCount, total]);

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">Attendees</h2>
      <ul className="list-disc pl-5">
        {attendees.map((att: AttendeeDto) => (
          <li style={{ color: "white" }} key={att.id}>
            {att.name} ({att.email})
          </li>
        ))}
      </ul>{" "}
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
    </div>
  );
}
