"use client";
import { useState } from "react";
import { Mail, User, Bell, Lock } from "lucide-react";
import EmailSettings from "./EmailSettings";
import PasswordSettings from "./PasswordSettings";
import NewsletterSettings from "./NewsletterSettings";
import TwoFactorSettings from "./TwoFactorSettings";
import TabNavigation from "./TabNavigation";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("email");

  const tabs = [
    { id: "email", label: "Email Settings", icon: <Mail className="h-5 w-5" /> },
    { id: "password", label: "Password Settings", icon: <User className="h-5 w-5" /> },
    // { id: "newsletter", label: "Newsletter Settings", icon: <Bell className="h-5 w-5" /> },
    { id: "twofactor", label: "Two-Factor Auth", icon: <Lock className="h-5 w-5" /> },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
    case "email":
      return <EmailSettings />;
    case "password":
      return <PasswordSettings />;
    case "newsletter":
      return <NewsletterSettings />;
    case "twofactor":
      return <TwoFactorSettings />;
    default:
      return <EmailSettings />;
    }
  };

  return (
    <div className="min-h-[600px] bg-[var(--color-astratintedwhite)] flex flex-col py-8 px-4">
      <div className="w-full max-w-5xl mx-auto p-6">
        <h1 className="text-[var(--color-astrablack)] text-xl md:text-2xl font-bold mb-4">
          Account Settings
        </h1>
        <div className="bg-white rounded-lg shadow-sm w-full flex flex-col md:flex-row">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="flex-1 p-8">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}