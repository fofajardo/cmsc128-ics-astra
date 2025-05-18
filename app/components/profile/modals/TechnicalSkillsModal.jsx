"use client";
import {useEffect, useState} from "react";
import SkillTag from "@/components/SkillTag";
import { XCircle } from "lucide-react";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {toast} from "@/components/ToastNotification.jsx";
import {clientRoutes} from "../../../../common/routes.js";
import axios from "axios";

export default function TechnicalSkillsModal({ context, skills: initialSkills }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(function() {
    if (open) {
      setSkills([...initialSkills]);
    }
  }, [open]);

  const handleAddSkill = function(e) {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      const newTag = {
        text: newSkill.trim(),
        color: "bg-green-100 text-green-800 border-green-300"
      };
      setSkills([...skills, newTag]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = function(index) {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  const handleSave = async function() {
    setIsSubmitting(true);
    try {
      const skillsJoined = skills.map((skill) => skill.text).join(",");
      await axios.put(clientRoutes.alumniProfiles.withId(context.state.user.id), {
        skills: skillsJoined,
      });
      setOpen(false);
      context.actions.patchProfile("skills", skillsJoined);
      toast({title: "Skills saved successfully!", variant: "success"});
    } catch (e) {
      toast({title: e.message, variant: "fail"});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = function() {
    setSkills([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-2 bg-[(var(--color-astradirtywhite)] text-[var(--color-astraprimary)] rounded-full">
        <PlusCircle size={20} />
      </DialogTrigger>
      <DialogContent loading={isSubmitting}>
        <DialogHeader>
          <DialogTitle>Edit Technical Skills</DialogTitle>
        </DialogHeader>
        <div className="mb-6">
          <div className="border border-gray-300 bg-white rounded-lg p-3 min-h-[64px] max-h-[200px] w-full flex flex-wrap gap-x-2 gap-y-2 overflow-y-auto">
            {skills.map((skill, index) => (
              <div key={index} className="relative group flex items-center">
                <SkillTag text={skill.text} color={skill.color} />
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="absolute -left-2 -top-2 bg-white rounded-full p-1 shadow group-hover:block hidden"
                >
                  <XCircle className="text-red-500 w-4 h-4" />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Add Skill"
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
