import EventForm from "@/components/EventForm";
import BackButton from "@/components/MicroComponents/BackButton";

export default function CreateEventPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <BackButton/>
      <div className="p-6 flex flex-col rounded shadow max-w-2xl w-full bg-gray-50/25 backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create New Event</h1>
        <EventForm />
      </div>
    </div>
  );
}
