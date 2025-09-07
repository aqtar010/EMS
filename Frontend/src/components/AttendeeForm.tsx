"use client";
import React, { useState } from "react";
import { AttendeeDto } from "@/lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface AttendeeFormProps {
  eventId: string;
  onRegister: (attendee: AttendeeDto) => Promise<void>;
}

export default function AttendeeForm({ onRegister }: AttendeeFormProps) {
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
      <Input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border rounded-sm p-2 w-full"
      />
      <Input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full rounded-sm"
      />
      <div className="flex justify-center">
        <Button
          type="submit"
          className=" w-md  p-2 rounded transition-colors hover:bg-white hover:text-black"
        >
          Register
        </Button>
      </div>
    </form>
  );
}
