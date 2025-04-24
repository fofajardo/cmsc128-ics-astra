export default function InformationChanged() {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#eff2fa" }}>
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-sm" style={{ backgroundColor: "#fbfdff" }}>
            <h1 className="text-xl font-medium mb-2" style={{ color: "#062441" }}>
              Has your information changed?
            </h1>
            <p className="text-sm mb-6" style={{ color: "#8595a4" }}>
              Please let us know if any of your personal details have changed since your last visit.
            </p>
  
            <div className="space-y-3">
              <button className="w-full py-2.5 px-4 border border-gray-200 rounded-md text-sm text-center">
                Yes, my information has changed
              </button>
              <button className="w-full py-2.5 px-4 border border-gray-200 rounded-md text-sm text-center">
                No, everything is the same
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  