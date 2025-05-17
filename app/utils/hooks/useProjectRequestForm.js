"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "projectRequestFormData";

export const useProjectRequestForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    projectType: "",
    targetDate: "",
    title: "",
    description: "",
    externalLink: ""
  });

  // Load data from localStorage on mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
        }
      } catch (error) {
        console.error("Error loading form data from localStorage:", error);
      }
    }
  }, []);

  // Update form data and localStorage
  const updateFormData = (newData) => {
    if (typeof window !== "undefined") {
      try {
        const updatedData = { ...formData, ...newData };
        setFormData(updatedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error saving form data to localStorage:", error);
      }
    }
  };

  // Clear form data
  const clearFormData = () => {
    if (typeof window !== "undefined") {
      try {
        setFormData({
          amount: "",
          projectType: "",
          targetDate: "",
          title: "",
          description: "",
          externalLink: ""
        });
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing form data from localStorage:", error);
      }
    }
  };

  return {
    formData,
    updateFormData,
    clearFormData,
  };
};