"use client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-astraprimary font-medium mb-6"
    >
      <Icon icon="mdi:arrow-left" className="text-2xl" />
      Back
    </button>
  );
}
