import { useState } from "react";
import {toast} from "@/components/ToastNotification.jsx";

export default function TwoFactorSettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [code, setCode] = useState("");

  const handleEnable2FA = () => {
    if (code === "123456") {
      toast({
        variant: "success",
        title: "Two-Factor Authentication Enabled!"
      });
      setTwoFactorEnabled(true);
      setRequestingCode(false);
      setCode("");
    } else {
      toast({
        variant: "fail",
        title: "Invalid verification code. Please try again."
      });
    }
  };

  const handleDisable2FA = () => {
    toast({
      variant: "success",
      title: "Two-Factor Authentication Disabled!"
    });
    setTwoFactorEnabled(false);
  };

  const handleStartEnable2FA = () => {
    setRequestingCode(true);
  };

  return (
    <div>
      <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">
        Two-Factor Authentication
      </h2>

      {!twoFactorEnabled ? (
        <>
          {!requestingCode ? (
            <button
              onClick={handleStartEnable2FA}
              className="bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white py-2 px-4 rounded-md text-sm md:text-base"
            >
              Enable 2FA
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm md:text-base font-medium text-[var(--color-astrablack)] mb-1">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter digit code"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>
              <button
                onClick={handleEnable2FA}
                className="bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white py-2 px-4 rounded-md text-sm md:text-base"
              >
                Verify and Enable
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={handleDisable2FA}
          className="bg-[var(--color-astrared)] hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm md:text-base"
        >
          Disable 2FA
        </button>
      )}
    </div>
  );
}