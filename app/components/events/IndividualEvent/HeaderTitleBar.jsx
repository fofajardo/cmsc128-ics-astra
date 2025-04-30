"use client";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderTitleBar({
  title,
  isEditMode,
  onEditToggle,
  onOpenEditModal,
  onDelete,
  onCancel
}) {
  return (
    <div className="mt-4 flex items-center justify-between flex-wrap">
      <h1 className="text-2xl font-bold text-astradarkgray">{title}</h1>

      {/* <AnimatePresence mode="wait">
        {!isEditMode ? (
          <motion.button
            key="viewMode"
            onClick={onEditToggle}
            className="focus:outline-none transition duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <Icon
              icon="mdi:file-document-outline"
              className="text-astraprimary text-2xl"
            />
          </motion.button>
        ) : (
          <motion.div
            key="editMode"
            className="flex gap-2 items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onOpenEditModal}
              className="bg-astraprimary text-astrawhite text-sm font-semibold px-3 py-1 rounded-md transition-all duration-300"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="bg-astrawhite text-astraprimary border border-astraprimary text-sm font-semibold px-3 py-1 rounded-md transition-all duration-300"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="bg-astragray text-astradarkgray text-sm font-semibold px-3 py-1 rounded-md transition-all duration-300"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}
