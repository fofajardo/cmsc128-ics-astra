export default function ConfirmationPrompt({ prompt, close, object, handleConfirm }) {
  return (
    <div className="fixed inset-0 bg-astrablack/60 flex items-center justify-center z-50 px-4">
      <div className="bg-astrawhite w-full max-w-lg rounded-xl p-5 sm:p-6">
        <h1 className="text-astrablack text-base sm:text-lg font-medium">{prompt}</h1>

        <div className="flex gap-3 mt-4 justify-start">
          <button
            onClick={handleConfirm}
            className="!cursor-pointer text-astrawhite bg-astraprimary border border-astraprimary font-medium px-4 py-1.5 text-sm sm:text-base rounded-md"
          >
            Yes
          </button>
          <button
            onClick={close}
            className="!cursor-pointer text-astraprimary border border-astraprimary font-medium px-4 py-1.5 text-sm sm:text-base rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
