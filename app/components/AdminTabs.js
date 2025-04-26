// tabs = { 'Pending': 3, 'Approved': 0, 'Rejected': 2 }
// currTab = ''
// handleTabChange()

export default function AdminTabs({ tabs, currTab, size, handleTabChange }) {
    return (
      <div className="flex flex-row w-full overflow-y-scroll scrollbar-hide">
        {Object.entries(tabs).map(([label, notif]) => (
          <Tab
            key={label}
            label={label}
            notif={notif}
            active={label === currTab}
            size = {size}
            handleTabChange={handleTabChange}
          />
        ))}
      </div>
    );
  }
  
  
function Tab({ label, active, notif, size, handleTabChange }) {
  return (
    <div
      className={`flex justify-center items-center flex-1 border-b-2 ${
        active
          ? 'border-astradark bg-astratintedwhite'
          : 'border-astragray bg-astrawhite hover:bg-astratintedwhite/25'
      }`}
    >
      <button
        onClick={() => handleTabChange(label)}
        className={`items-center flex ${size ? `${size} py-2` : 'font-lb py-3'} bg-transparent w-full justify-center ${
          active ? 'text-astradark' : 'bg-astrawhite text-astradarkgray'
        }`}
      >
        {label}
        {notif > 0 && (
          <span className="ml-2 bg-astrared font-s text-white px-2 py-1 rounded-sm">
            {notif}
          </span>
        )}
      </button>
    </div>
  );
}
