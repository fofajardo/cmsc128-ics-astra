"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useTabNavigation(defaultTab = "email", validTabs = []) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = useCallback((tabId) => {
    if (!validTabs.includes(tabId)) {
      console.warn(`Invalid tab: ${tabId}`);
      return;
    }

    setActiveTab(tabId);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tabId);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } catch (error) {
      console.error("Error updating URL:", error);
    }
  }, [searchParams, router, pathname, validTabs]);

  useEffect(function() {
    const currentTab = searchParams.get("tab");

    if (currentTab && validTabs.includes(currentTab)) {
      setActiveTab(currentTab);
    } else if (currentTab && !validTabs.includes(currentTab)) {
      // Invalid tab - redirect to default
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", defaultTab);
        router.replace(`${pathname}?${params.toString()}`);
        setActiveTab(defaultTab);
      } catch (error) {
        console.error("Error redirecting to default tab:", error);
        setActiveTab(defaultTab);
      }
    } else if (!currentTab) {
      // No tab - set default
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", defaultTab);
        router.replace(`${pathname}?${params.toString()}`);
        setActiveTab(defaultTab);
      } catch (error) {
        console.error("Error setting default tab:", error);
        setActiveTab(defaultTab);
      }
    }

    setIsLoading(false);
  }, [searchParams, router, pathname, defaultTab, validTabs]);

  return {
    activeTab,
    handleTabChange,
    isLoading
  };
}
