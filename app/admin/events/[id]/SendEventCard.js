"use client";

export default function SendEventCard({
  selectedOption,
  setSelectedOption,
  message,
  setMessage,
  handleSend,
}) {
  return (
    <div className="bg-astrawhite p-6 rounded-2xl shadow-md flex flex-col flex-1">
      <h2 className="text-lg font-semibold mb-4">Send this event to</h2>
      <select
        className="w-full border border-astragray rounded-lg p-2 mb-4 text-astradarkgray"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option>Everyone</option>
        <option>Selected Users</option>
        <option>Groups</option>
      </select>

      <label className="text-sm text-astradarkgray mb-1 block">Message (optional)</label>
      <textarea
        className="w-full border border-astragray rounded-lg p-2 mb-4 flex-1 text-astradarkgray"
        rows="3"
        placeholder="Type here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="w-full bg-astraprimary hover:bg-astradark text-astrawhite font-semibold py-2 rounded-lg transition-all"
      >
        Send
      </button>
    </div>
  );
}
