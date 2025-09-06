import EventForm from "@/components/EventForm";

export default function CreateEventPage() {
  return (
<div className="min-h-screen flex items-center justify-center">
  <div className="p-6 flex flex-col rounded shadow max-w-2xl w-full bg-gray-50/25 backdrop-blur-md">
    <h1 className="text-2xl font-bold mb-4 flex justify-center">Create New Event</h1>
    <EventForm />
  </div>
</div>

  );
}
