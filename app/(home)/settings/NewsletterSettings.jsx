import { useState } from "react";

export default function NewsletterSettings({ setShowToast }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleToggleSubscription = () => {
    const newSubscriptionStatus = !isSubscribed;
    setIsSubscribed(newSubscriptionStatus);

    setShowToast({
      type: "success",
      message: newSubscriptionStatus
        ? "Subscribed to newsletter!"
        : "Unsubscribed from newsletter!"
    });
  };

  return (
    <div>
      <h2 className="text-[var(--color-astrablack)] text-md md:text-xl font-semibold mb-4">
        {isSubscribed ? "Unsubscribe from newsletter" : "Subscribe to newsletter"}
      </h2>
      <p className="text-gray-600 mb-4 text-sm md:text-base">
        {isSubscribed
          ? "Stop receiving our newsletter emails"
          : "Receive our latest newsletter and updates."
        }
      </p>
      <button
        onClick={handleToggleSubscription}
        className={`w-full ${
          isSubscribed
            ? "bg-[var(--color-astrared)] hover:bg-red-700"
            : "bg-[var(--color-astraprimary)] hover:bg-[var(--color-astradark)]"
        } text-white py-2 px-4 rounded-md text-sm md:text-base`}
      >
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
      </button>
    </div>
  );
}