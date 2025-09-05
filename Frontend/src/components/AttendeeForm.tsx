"use client";
import React, { useState } from "react";
import { AttendeeDto } from "@/lib/api";

interface AttendeeFormProps {
  eventId: string;
  onRegister: (attendee: AttendeeDto) => Promise<void>;
}

export default function AttendeeForm({  onRegister }: AttendeeFormProps) {
  const [form, setForm] = useState<AttendeeDto>({ name: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(form);
    setForm({ name: "", email: "" }); // Optionally reset form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Register
      </button>
    </form>
  );
}
