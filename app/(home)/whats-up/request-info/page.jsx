"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, FileText, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { GoBackButton } from "@/components/Buttons";

export default function RequestInstructionsPage() {
  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Prepare Required Information",
      description: "Have your student details ready (Student number, graduation year, current contact information)",
      color: "text-blue-600",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Send Email Request",
      description: "Email ics.uplb@up.edu.ph with subject line 'Alumni Information Request'",
      color: "text-green-600",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Wait for Processing",
      description: "Requests are typically processed within 3-5 business days",
      color: "text-orange-600",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Receive Response",
      description: "You'll receive an email with the requested information or further instructions",
      color: "text-purple-600",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <GoBackButton />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Request Alumni Information
          </h1>
          <p className="text-lg text-gray-600">
            Follow these simple steps to request information about ICS alumni
          </p>
        </motion.div>

        <div className="grid gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 flex items-start gap-6"
            >
              <div className={`${step.color} shrink-0`}>
                {step.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Email Template
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
            <p>Subject: Alumni Information Request</p>
            <br />
            <p>Dear ICS Admin,</p>
            <br />
            <p>I would like to request information regarding ICS alumni. Here are my details:</p>
            <br />
            <p>Name: [Your Full Name]</p>
            <p>Student Number: [Your 10-digit Student Number]</p>
            <p>Graduation Year: [Year]</p>
            <p>Contact Number: [Your Contact Number]</p>
            <p>Current Email: [Your Email Address]</p>
            <br />
            <p>Information Requested:</p>
            <p>[Specify the information you&apos;re looking for]</p>
            <br />
            <p>Purpose of Request:</p>
            <p>[Briefly explain why you need this information]</p>
            <br />
            <p>Thank you for your assistance.</p>
            <br />
            <p>Best regards,</p>
            <p>[Your Name]</p>
          </div>

          <div className="mt-8 space-y-4 text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-red-500">*</span>
              Please ensure all information provided is accurate and complete.
            </p>
            <p className="flex items-center gap-2">
              <span className="text-red-500">*</span>
              Requests may take 3-5 business days to process.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="mailto:ics.uplb@up.edu.ph?subject=Alumni%20Information%20Request"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Compose Email
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
