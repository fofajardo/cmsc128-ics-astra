"use client";
import { useEffect, useState } from "react";
import {CheckCircle2Icon, XCircle, XIcon} from "lucide-react";
import React from "react";
import { toast as sonnerToast } from "sonner";

export function toast(toast) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      variant={toast.variant}
    />
  ));
}

function Toast(props) {
  const { title, description, id, variant } = props;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const styles = {
    success: "bg-astragreen text-astrawhite",
    fail: "bg-astrared text-astrawhite",
  };

  const icons = {
    success: <CheckCircle2Icon></CheckCircle2Icon>,
    fail: <XCircle></XCircle>,
  };

  return (
    <div
      className={`px-4 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        ${styles[variant]}`}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <span>{icons[variant]}</span>
            <p className="text-sm font-medium">
              {title}
            </p>
          </div>
          <p className="text-sm">{description}</p>
        </div>
      </div>

      <div className="ml-5 shrink-0 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
        <button onClick={() => {
          sonnerToast.dismiss(id);
          setVisible(false);
        }} className="ml-4 mt-1 text-xl"><XIcon /></button>
      </div>
    </div>
  );
}

export default function ToastNotification({ type = "success", message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false); // Start fade-out
      setTimeout(onClose, 300); // Remove after transition
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-astragreen text-astrawhite",
    fail: "bg-astrared text-astrawhite",
  };

  const icons = {
    success: <CheckCircle2Icon></CheckCircle2Icon>,
    fail: <XCircle></XCircle>,
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] transition-all duration-300 ease-in-out 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} 
        ${styles[type]}`}
    >
      <div className="flex items-center gap-2">
        <span>{icons[type]}</span>
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={() => setVisible(false)} className="ml-4 text-xl">×</button>
    </div>
  );
}
