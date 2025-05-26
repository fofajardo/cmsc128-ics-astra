import { useState } from "react";

export default function EmailSettings({ setShowToast }) {
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleUpdateEmail = () => {
    if (!newEmail || !isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setShowToast({
      type: "success",
      message: "Verification code sent to email!"
    });
    setIsVerificationVisible(true);
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setCodeError("Please enter the verification code.");
    } else {
      setCodeError("");
      setShowToast({
        type: "success",
        message: "Email updated successfully!"
      });
      setIsVerificationVisible(false);
      setNewEmail("");
      setVerificationCode("");
    }
  };

  const handleResendCode = () => {
    setShowToast({
      type: "success",
      message: "Verification code resent!"
    });
  };

  return (
    <div>
      <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">
        Change Email Address
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="current-email" className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">
            Current Email
          </label>
          <input
            id="current-email"
            type="email"
            value="jmdelacruz@up.edu.ph"
            readOnly
            className="text-sm md:text-base bg-[var(--color-astradirtywhite)] text-gray-500 w-full py-2 px-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="new-email" className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">
            New Email Address <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="new-email"
              type="email"
              placeholder="Enter your new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="text-sm md:text-base w-full py-2 px-3 border border-gray-300 rounded-md"
            />
            <button
              className={`text-sm md:text-base px-4 py-2 text-white rounded-md ${
                isValidEmail(newEmail)
                  ? "bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleUpdateEmail}
              disabled={!isValidEmail(newEmail)}
            >
              Update
            </button>
          </div>
          {emailError && <p className="text-red-500 text-sm md:text-base mt-1">{emailError}</p>}
        </div>

        {isVerificationVisible && (
          <div className="space-y-2">
            <label htmlFor="verification-code" className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">
              Verification Code <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="verification-code"
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-grow py-2 px-3 border border-gray-300 rounded-md text-sm md:text-base"
              />
              <button
                onClick={handleResendCode}
                className="bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white py-2 px-4 rounded-md text-sm md:text-base"
              >
                Resend
              </button>
            </div>
            {codeError && <p className="text-red-500 text-sm md:text-base">{codeError}</p>}
            <button
              onClick={handleVerifyCode}
              className="w-full bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white mt-2 p-2 rounded-md text-sm md:text-base"
            >
              Verify Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}