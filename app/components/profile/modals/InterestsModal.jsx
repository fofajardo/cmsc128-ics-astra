"use client";
import {useEffect, useState} from "react";
import SkillTag from "@/components/SkillTag";
import {PlusCircle, XCircle} from "lucide-react";
import {toast} from "@/components/ToastNotification";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function InterestsModal({ context, interests: initialInterests }) {
  const [interests, setInterests] = useState([...initialInterests]);
  const [newInterest, setNewInterest] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(function() {
    if (open) {
      setInterests([...initialInterests]);
    }
  }, [open]);

  const handleAddInterest = (e) => {
    if (e.key === "Enter" && newInterest.trim() !== "") {
      const newTag = {
        text: newInterest.trim(),
        color: "bg-indigo-100 text-indigo-800 border-indigo-300"
      };
      setInterests([...interests, newTag]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index) => {
    const updated = [...interests];
    updated.splice(index, 1);
    setInterests(updated);
  };

  const handleSave = async function() {
    setIsSubmitting(true);
    try {
      const interestsJoined = interests.map((interest) => interest.text).join(",");
      await axios.put(clientRoutes.alumniProfiles.withId(context.state.user.id), {
        interests: interestsJoined,
      });
      setOpen(false);
      context.actions.patchProfile("interests", interestsJoined);
      toast({title: "Interests saved successfully!", variant: "success"});
    } catch (e) {
      toast({title: e.message, variant: "fail"});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = function() {
    setInterests([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-2 bg-[(var(--color-astradirtywhite)] text-[var(--color-astraprimary)] rounded-full">
        <PlusCircle size={20} />
      </DialogTrigger>
      <DialogContent loading={isSubmitting}>
        <DialogHeader>
          <DialogTitle>Edit Fields of Interest</DialogTitle>
        </DialogHeader>
        <div className="mb-6">
          <div className="border border-gray-300 bg-white rounded-lg p-3 min-h-[64px] max-h-[200px] w-full flex flex-wrap gap-x-2 gap-y-2 overflow-y-auto">
            {interests.map((interest, index) => (
              <div key={index} className="relative group flex items-center">
                <SkillTag text={interest.text} color={interest.color} />
                <button
                  onClick={() => handleRemoveInterest(index)}
                  className="absolute -left-2 -top-2 bg-white rounded-full p-1 shadow group-hover:block hidden"
                >
                  <XCircle className="text-red-500 w-4 h-4" />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleAddInterest}
              placeholder="Add Field"
              className="text-xs bg-white border border-gray-300 rounded-full px-4 py-2 h-8 w-40 outline-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-wrap justify-between gap-4">
          <button
            onClick={handleClearAll}
            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 border border-red-500 text-red-600 rounded-lg bg-white hover:bg-red-50"
          >
            Clear All
          </button>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSave}
              className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)]"
            >
              Save
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}