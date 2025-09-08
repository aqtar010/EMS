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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (form: AttendeeDto): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      // Simple email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Email is invalid.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    await onRegister(form);
    setForm({ name: "", email: "" }); // Optionally reset form
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="max-h-[3rem] pb-4">
        <Input
          name="name"
          placeholder="Name"
          value={form.name}
          autoComplete="off"
          onChange={handleChange}
          className="border rounded-sm p-2 w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>
      <div className="max-h-[3rem] pb-4">
        <Input
          name="email"
          placeholder="Email"
          autoComplete="off"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full rounded-sm"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>
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
