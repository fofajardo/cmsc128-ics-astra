"use client";

export default function PasswordReset() {
  const handleContinue = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-astratintedwhite)]">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-lg shadow-sm text-center bg-[var(--color-astrawhite)]">
          <div className="flex justify-center mb-4">
            <img src="/recover/assets/verify-icon.png" alt="Key Icon" width="60" height="60" />
          </div>

          <h1 className="text-xl font-medium mb-2 text-[var(--color-astrablack)]">
            Password reset!
          </h1>
          <p className="text-sm mb-6 text-gray-700">
            Your password has been successfully reset. Click below to log in magically.
          </p>

          <button
            className="w-full py-2.5 px-4 rounded-md text-sm text-white bg-[var(--color-astraprimary)]"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
