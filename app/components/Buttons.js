"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import ToastNotification from "@/components/ToastNotification";

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={"inline-flex items-baseline text-astrablack hover:text-astradark font-rb"}
    >
      <span className="mr-1 text-xl">←</span>
      Go Back
    </button>
  );
}


export function ActionButton({ label, color, size = "small", flex, onClick, route, notifyMessage, notifyType }) {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  const handleClick = () => {
    if (onClick) return onClick();
    if (route) return router.push(route);
    if (notifyMessage) {
      setToast({ type:notifyType || "success", message: notifyMessage});
    }
  };

  const sizeClasses = {
    small: "px-3 py-2 font-sb",
    medium: "px-5 py-2 font-sb",
    large: "px-5 py-2 font-rb",
  };

  return (
    <>
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <button className={`${color}-button ${sizeClasses[size] || sizeClasses.small} ${flex}`} onClick={handleClick}>
        {label}
      </button>
    </>
  );
}