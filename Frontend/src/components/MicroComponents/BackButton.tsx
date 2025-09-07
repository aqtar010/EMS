"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="absolute top-6 left-6 text-lg  px-4 py-2"
    >
      Back
    </Button>
  );
}
