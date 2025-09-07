"use client";
import { AttendeeDto, EventsApi } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
      <div className="h-65">
      <h2 className="text-xl font-semibold mt-6">Attendees</h2>
      <ul className="list-disc pl-5">
        {attendees.map((att: AttendeeDto) => (
          <li key={att.id} className="text-white">
            {att.name} ({att.email})
          </li>
        ))}
      </ul>
      </div>


      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={`transition-colors hover:bg-white hover:text-black ${
                  page === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  className="transition-colors hover:bg-white hover:text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Optional Ellipsis if many pages */}
            {totalPages > 7 && <PaginationEllipsis />}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={`transition-colors hover:bg-white hover:text-black ${
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
