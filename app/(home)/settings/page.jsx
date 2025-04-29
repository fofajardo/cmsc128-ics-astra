"use client";
import { useState } from "react";
import { Mail, Eye, EyeOff, User, Bell, ChevronRight, Lock } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";

export default function AccountSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [code, setCode] = useState("");

  // Simulate verification process
  const handleEnable2FA = () => {
    if (code === "123456") {
      setShowToast({
        type: "success",
        message: "Two-Factor Authentication Enabled!"
      });
      setTwoFactorEnabled(true);
      setRequestingCode(false);
      setCode("");
    } else {
      setShowToast({
        type: "fail",
        message: "Invalid verification code. Please try again."
      });
    }
  };

  const handleDisable2FA = () => {
    setShowToast({
      type: "success",
      message: "Two-Factor Authentication Disabled!"
    });
    setTwoFactorEnabled(false);
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const tabs = [
    { id: "email", label: "Email Settings", icon: <Mail className="h-5 w-5" /> },
    { id: "password", label: "Password Settings", icon: <User className="h-5 w-5" /> },
    { id: "newsletter", label: "Newsletter Settings", icon: <Bell className="h-5 w-5" /> },
    { id: "twofactor", label: "Two-Factor Auth", icon: <Lock className="h-5 w-5" /> },
  ];

  const handleUpdateEmail = () => {
    if (!newEmail || !isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
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
    }
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordError("");
    setShowToast({
      type: "success",
      message: "Password updated successfully!"
    });
  };

  const handleResendCode = () => {
    setShowToast({
      type: "success",
      message: "Verification code resent!"
    });
  };

  const handleToggleSubscription = () => {
    setIsSubscribed(!isSubscribed);
    setShowToast({
      type: "success",
      message: isSubscribed ? "Unsubscribed from newsletter!" : "Subscribed to newsletter!"
    });
  };

  return (
    <div className="min-h-[600px] bg-[var(--color-astratintedwhite)] flex flex-col py-8 px-4">
      <div className="w-full max-w-5xl mx-auto p-6">
        <h1 className="text-[var(--color-astrablack)] text-xl md:text-2xl font-bold mb-4">Account Settings</h1>
        <div className="bg-white rounded-lg shadow-sm w-full flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-r border-gray-200">
            <div className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm w-full flex items-center justify-between p-3 rounded-md text-left ${
                    activeTab === tab.id ? "bg-blue-50 text-[var(--color-astraprimary)]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">{tab.icon}<span>{tab.label}</span></div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === tab.id ? "sm:rotate-90" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {activeTab === "email" && (
              <div>
                <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">Change Email Address</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-email" className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">Current Email</label>
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
                        className={`text-sm md:text-base px-4 py-2 text-white rounded-md ${isValidEmail(newEmail) ? "bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)]" : "bg-gray-400 cursor-not-allowed"}`}
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
                        <button onClick={handleResendCode} className="bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white py-2 px-4 rounded-md text-sm md:text-base">
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
            )}

            {activeTab === "password" && (
              <div>
                <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">Current Password <span className="text-[var(--color-astrared)]">*</span></label>
                    <div className="relative">
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="text-sm md:text-base pr-10 w-full py-2 px-3 border border-gray-300 rounded-md"
                      />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3">
                        {showCurrentPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">New Password <span className="text-[var(--color-astrared)]">*</span></label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="text-sm md:text-base pr-10 w-full py-2 px-3 border border-gray-300 rounded-md"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3">
                        {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">Confirm Password <span className="text-[var(--color-astrared)]">*</span></label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="text-sm md:text-base pr-10 w-full py-2 px-3 border border-gray-300 rounded-md"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  {passwordError && <p className="text-red-500 text-sm md:text-base">{passwordError}</p>}
                  <button
                    onClick={handleSavePassword}
                    className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white py-2 px-4 rounded-md"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "newsletter" && (
              <div>
                <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">
                  {isSubscribed ? "Unsubscribe from newsletter" : "Subscribe to newsletter"}
                </h2>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  {isSubscribed ? "Stop receiving our newsletter emails" : "Receive our latest newsletter and updates."}
                </p>
                <button
                  onClick={handleToggleSubscription}
                  className={`w-full ${isSubscribed ? "bg-[var(--color-astrared)] hover:bg-red-700" : "bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)]"} text-white py-2 px-4 rounded-md text-sm md:text-base`}
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              </div>
            )}

            {activeTab === "twofactor" && (
              <div>
                <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">
                  Two-Factor Authentication
                </h2>

                {!twoFactorEnabled ? (
                  <>
                    {!requestingCode ? (
                      <button
                        onClick={() => setRequestingCode(true)}
                        className="bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white py-2 px-4 rounded-md text-sm md:text-base"
                      >
                        Enable 2FA
                      </button>
                    ) : (
                      <>
                        <div className="mb-4">
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
                      </>
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
            )}
          </div>
        </div>
      </div>

      {showToast && (
        <ToastNotification
          type={showToast.type}
          message={showToast.message}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
