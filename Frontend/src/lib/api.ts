import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5082/api", // ASP.NET backend base URL
  headers: { "Content-Type": "application/json" },
});

// Event DTOs
export interface EventDto {
  id?: string;
  name: string;
  location: string;
  startTime: Date | string;
  endTime: Date | string;
  maxCapacity: number;
  timeZone?: string; // Optional time zone field
}
export interface AttendeeListDto {
    attendees: AttendeeDto[],
    totalAttendees: number;
}

export interface AttendeeDto {
    
  id?: string;
  name: string;
  email: string;

    
}

export const EventsApi = {
  getEvents: () => api.get<EventDto[]>("/Events"),
  createEvent: (data: EventDto) => api.post("/Events", data),
  registerAttendee: (eventId: string, data: AttendeeDto) =>
    api.post(`/Events/${eventId}/register`, data),
  getAttendees: (eventId: string, page = 1, pageSize = 10) =>
  api.get<AttendeeListDto>(`/Events/${eventId}/attendees?pageNumber=${page}&pageSize=${pageSize}`),
  deleteEvent: (eventId: string) =>
    api.delete(`/Events/${eventId}`),
};
