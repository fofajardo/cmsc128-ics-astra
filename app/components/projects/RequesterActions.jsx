"use client";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

export default function RequesterActions({ project, onApprove, onTriggerDeclineModal, onContact }) {
  return (
    <div className="space-y-6 lg:sticky lg:top-24 self-start">
      <div className="bg-astrawhite p-6 rounded-xl shadow">
        <h2 className="font-lb text-xl mb-4">Requester Information</h2>
        <div className="space-y-4">
          <div className="flex gap-2 items-start">
            <User className="w-10 h-10 text-astraprimary" />
            <div>
              <p className="text-astradarkgray">{project?.requester?.name}</p>
              <p className="text-astralightgray text-sm">{project?.requester?.position}</p>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <Mail className="w-6 h-6 text-astraprimary" />
            <p className="text-astradarkgray">{project?.requester?.email}</p>
          </div>
          <div className="flex gap-2 items-start">
            <Phone className="w-6 h-6 text-astraprimary" />
            <p className="text-astradarkgray">{project?.requester?.phone}</p>
          </div>
          <button
            className="flex items-center gap-2 mt-4 bg-astraprimary text-astrawhite py-2 px-4 rounded-lg w-full justify-center font-sb hover:bg-astraprimary/90"
            onClick={onContact}
          >
            <MessageSquare className="w-5 h-5" />
            Contact
          </button>
        </div>
      </div>

      <div className="bg-astrawhite p-6 rounded-xl shadow">
        <h2 className="font-lb text-xl mb-4">Actions</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={onApprove}
            className="bg-astragreen text-astrawhite py-3 px-6 rounded-lg font-sb hover:bg-astragreen/90 shadow-md"
          >
            Approve Project
          </button>
          <button
            onClick={onTriggerDeclineModal}
            className="bg-astrared text-astrawhite py-3 px-6 rounded-lg font-sb hover:bg-astrared/90 shadow-md"
          >
            Decline Project
          </button>
        </div>
      </div>
    </div>
  );
}
