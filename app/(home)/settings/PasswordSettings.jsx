import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordSettings({ setShowToast }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const PasswordInput = ({
                           id,
                           label,
                           value,
                           onChange,
                           showPassword,
                           toggleShowPassword
                         }) => (
    <div>
      <label htmlFor={id} className="block text-sm md:text-base font-medium text-[var(--color-astrablack)]">
        {label} <span className="text-[var(--color-astrared)]">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="text-sm md:text-base pr-10 w-full py-2 px-3 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 pr-3"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">
        Change Password
      </h2>
      <div className="space-y-4">
        <PasswordInput
          id="current-password"
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          showPassword={showCurrentPassword}
          toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
        />

        <PasswordInput
          id="new-password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showNewPassword}
          toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
        />

        <PasswordInput
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {passwordError && (
          <p className="text-red-500 text-sm md:text-base">{passwordError}</p>
        )}

        <button
          onClick={handleSavePassword}
          className="text-sm md:text-base w-full bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)] text-white py-2 px-4 rounded-md"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}