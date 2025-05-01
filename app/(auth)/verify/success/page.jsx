"use client";

export default function EmailVerified() {
  const handleContinue = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-astratintedwhite)]">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-sm text-center bg-[var(--color-astrawhite)]">
          <div className="flex justify-center mb-4">
            <img
              src="/recover/assets/verify-icon.png"
              alt="Verification Icon"
              width={60}
              height={60}
            />
          </div>

          <h1 className="text-xl font-medium mb-2 text-[var(--color-astrablack)]">
            Email verified!
          </h1>
          <p className="text-sm mb-6 text-gray-700">
            Your email has now been verified.
          </p>

          <button
            className="w-full py-2.5 px-4 rounded-md text-sm text-white bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] transition-colors"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
