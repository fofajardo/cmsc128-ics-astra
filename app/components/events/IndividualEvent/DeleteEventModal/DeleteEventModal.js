'use client';

export default function DeleteConfirmationModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-astrablack/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-50 bg-white p-6 rounded-2xl shadow-2xl max-w-md w-[90%] text-center">
        <h2 className="text-xl font-semibold text-astrablack mb-4">Confirm Deletion</h2>
        <p className="text-sm text-astradarkgray mb-6">
          Are you sure you want to delete <span className="font-bold">{title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="gray-button min-w-[100px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="red-button min-w-[100px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
