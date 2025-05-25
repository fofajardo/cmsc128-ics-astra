"use client";

import { useState, useEffect } from "react";
import { useParams,useSearchParams } from "next/navigation";
import Throbber from "../../../../components/projects/Throbber";
import DonationSuccess from "../../../../components/projects/DonationSuccess";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { DONATION_MODE_OF_PAYMENT, PROJECT_STATUS, REQUEST_STATUS, PhotoType} from "../../../../../common/scopes";
import { useSignedInUser } from "@/components/UserContext";
import { formatCurrency } from "@/utils/format";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { X } from "lucide-react";

async function uploadReceiptImage(userId, projectId, file) {
  try {
    if (!file) return null;

    // Create form data for the receipt upload
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("content_id", projectId);
    formData.append("type", PhotoType.PROOF_OF_PAYMENT);
    formData.append("File", file);

    // Upload the receipt image
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status === "CREATED") {
      return response.data.photo?.id || null;
    } else {
      // console.error("Failed to upload receipt:", response.data);
      return null;
    }
  } catch (error) {
    // console.error("Error uploading receipt:", error);
    return null;
  }
}

export default function DonatePage() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(null);
  const [status, setStatus] = useState("idle");
  const [showToast, setShowToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canDonate, setCanDonate] = useState(false);

  // Credit/debit fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const user = useSignedInUser();

  useEffect(() => {
    const fetchProjectRequest = async () => {
      try {
        setLoading(true);
        const projectResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects/${id}`);
        const projectData = projectResponse.data;
        if (projectData.status === "OK") {
          const projectId = projectData.list.projectData.project_id;
          const donationLink = projectData.list.projectData.donation_link;
          const isAbsoluteUrl = /^(https?:\/\/)/.test(donationLink);

          const projectStatus = new Date(projectData.list.projectData.due_date) < new Date() ? PROJECT_STATUS.FINISHED : projectData.list.projectData.project_status;
          const requestStatus = projectData.list.status;

          setCanDonate(projectStatus !== PROJECT_STATUS.FINISHED && requestStatus === REQUEST_STATUS.APPROVED
            ? true : false);

          setProjectData({
            id: projectId,
            title: projectData.list.projectData.title,
            donationLink: isAbsoluteUrl ? donationLink : `https://${donationLink}`,
            projectStatus: projectStatus,
            requestStatus: requestStatus,
            dueDate: projectData.list.projectData.due_date
          });

          setPaymentMethod(donationLink ? "external" : "bank");

        } else {
          ; // console.error("Unexpected response: ", projectData);
        }
      } catch (error) {
        ; // console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectRequest();
  }, []);

  const createDonation = async () => {
    try {
      setStatus("loading"); // Start loading state

      const generatedRefNum = "REF" + uuidv4();
      const userId = user?.state?.user?.id;

      // Upload receipt image first (if available)
      let receiptPhotoId = null;
      if (receipt) {
        receiptPhotoId = await uploadReceiptImage(userId, projectData.id, receipt);

        if (!receiptPhotoId) {
          setShowToast({ type: "fail", message: "Failed to upload receipt. Please try again." });
          setStatus("idle");
          return;
        }
      }

      // Create donation record with reference to the uploaded receipt
      const data = {
        user_id: userId,
        project_id: projectData.id,
        donation_date: new Date().toISOString(),
        reference_num: generatedRefNum,
        mode_of_payment: paymentMethod === "external" ?
          DONATION_MODE_OF_PAYMENT.PHYSICAL_PAYMENT :
          DONATION_MODE_OF_PAYMENT.BANK_TRANSFER,
        amount: amount,
        is_anonymous: isAnonymous,
        comment: null,
        receipt_photo_id: receiptPhotoId, // Link to the uploaded receipt photo
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations`, data);
      const donationData = response.data;

      if (donationData.status === "CREATED") {
        setStatus("success"); // Show success UI
      } else {
        // console.error("Unexpected response:", donationData);
        setShowToast({ type: "fail", message: "Failed to process donation. Please try again." });
        setStatus("idle"); // Return to idle state
      }
    } catch (error) {
      // console.error("Failed to create donation:", error);
      setShowToast({ type: "fail", message: "An error occurred. Please try again." });
      setStatus("idle"); // Return to idle state
    }
  };

  const handleAmountChange = (newAmount) => {
    setAmount(Number(newAmount));
  };

  const handleDonate = () => {
    const amountRegex = /^\d+$/;
    if (!amountRegex.test(amount) || amount <= 0) {
      setShowToast({ type: "fail", message: "Please enter a valid non-zero amount in pesos." });
      return;
    }

    if (paymentMethod === "paypal") {
      window.location.href = "https://www.paypal.com/signin";
      return;
    }

    if (paymentMethod === "credit") {
      if (!cardNumber || !expiry || !cvv || !cardName) {
        setShowToast({ type: "fail", message: "Please complete all credit/debit card fields." });
        return;
      }
    }

    if (paymentMethod === "bank" || paymentMethod === "external" && !receipt) {
      setShowToast({ type: "fail", message: "Please upload a receipt before donating." });
      return;
    }

    if (isAnonymous === null) {
      setShowToast({ type: "fail", message: "Please select whether you want to donate anonymously." });
      return;
    }

    createDonation();

    setStatus("loading");
    setTimeout(() => setStatus("success"), 2000);
  };

  if (status === "loading") return <Throbber />;
  if (status === "success") return <DonationSuccess />;

  return (
    <div className="min-h-screen bg-[#f4f7fe] text-astralightgray-800 px-4 py-10">
      {showToast && (
        <ToastNotification
          type={showToast.type}
          message={showToast.message}
          onClose={() => setShowToast(null)}
        />
      )}

      <div className="max-w-xl mx-auto mb-4">
        <BackButton />
      </div>

      <div className="max-w-xl mx-auto bg-astrawhite shadow-md rounded-lg px-6 py-8">
        {loading ?
          <div className="w-full flex items-center justify-center">
            <LoadingSpinner className="w-16 h-16" />
          </div>
          : canDonate ? (
            <>
              <h1 className="text-xl font-semibold mb-2">Your Donation</h1>
              <p className="text-sm text-astralightgray-500 mb-6">Donating to: <strong>{projectData?.title || "Donation Drive"}</strong></p>

              {/* Amount Section */}
              <div className="border-b border-astralightgray-200 pb-6 mb-6">
                <h3 className="text-sm font-medium mb-4">Enter Amount</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[1000, 2500, 5000, 10000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAmountChange(preset)}
                      className={`text-sm py-2 rounded-md border font-medium transition ${
                        amount === preset
                          ? "bg-[var(--color-astraprimary)] text-astrawhite border-[var(--color-astraprimary)]"
                          : "bg-astrawhite text-astralightgray-700 border-astralightgray-300 hover:bg-[var(--color-astraprimary)] hover:text-astrawhite"
                      }`}
                    >
                      ₱{preset}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-astralightgray-500">PHP</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-astralightgray-300 rounded-md text-center font-semibold text-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="border-b border-astralightgray-200 pb-6 mb-6">
                <h3 className="text-sm font-medium mb-4">Select Payment Method</h3>
                <div className="flex flex-col gap-4 mb-6">
                  {/* PayPal */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled
                    />
                    <img src="/icons/paypal.svg" alt="PayPal" className="w-16 h-auto" />
                  </label>

                  {/* Credit/Debit */}
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="payment"
                      value="credit"
                      checked={paymentMethod === "credit"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled
                    />
                    Credit/Debit Card
                  </label>

                  {paymentMethod === "credit" && (
                    <div className="pl-6 space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Expiry Date (MM/YY)"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="flex-1 border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-20 border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Bank Transfer */}
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    {projectData?.donationLink ? <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled
                    /> :
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />}
                    Bank Transfer
                  </label>

                  {/* Bank Transfer */}
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="payment"
                      value="external"
                      checked={paymentMethod === "external"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    External Donation Link
                  </label>

                  {paymentMethod === "external" && (
                    <div className="pl-6">
                      <a
                        href={projectData?.donationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {projectData?.donationLink}
                      </a>
                    </div>
                  )}

                  {(paymentMethod === "bank" || paymentMethod === "external") && (
                    <div className="pl-6 mt-4">
                      <h3 className="text-sm font-medium mb-2">Upload your receipt</h3>
                      <div className="space-y-3">
                        {receipt ? (
                          <div className="relative">
                            <div className="border border-astralightgray-300 rounded-md p-2 bg-blue-50">
                              <div className="flex items-center justify-between">
                                <span className="text-sm truncate max-w-[200px]">
                                  {receipt.name}
                                </span>
                                <button
                                  onClick={() => setReceipt(null)}
                                  className="text-red-600 hover:text-red-800"
                                  type="button"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              {receipt.type.startsWith("image/") && (
                                <div className="mt-2">
                                  <img
                                    src={URL.createObjectURL(receipt)}
                                    alt="Receipt preview"
                                    className="max-h-32 mx-auto object-contain"
                                    onLoad={() => URL.revokeObjectURL(receipt)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-astralightgray-300 rounded-md p-4 text-center">
                            <input
                              type="file"
                              id="receipt-upload"
                              accept="image/*,application/pdf"
                              onChange={(e) => setReceipt(e.target.files[0])}
                              className="hidden"
                            />
                            <label
                              htmlFor="receipt-upload"
                              className="flex flex-col items-center cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-astralightgray-400 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <span className="text-sm text-astralightgray-500">
                                Click to upload receipt
                              </span>
                              <span className="text-xs text-astralightgray-400 mt-1">
                                JPG or PNG up to 5MB
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <label
                    htmlFor="anonymous-yes"
                    className="text-sm text-astralightgray-700"
                  >
                    Donate anonymously
                  </label>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        id="anonymous-yes"
                        name="anonymous"
                        value="yes"
                        checked={isAnonymous === true}
                        onChange={() => setIsAnonymous(true)}
                        className="h-4 w-4 text-[var(--color-astraprimary)] bg-white border border-astralightgray-300 rounded focus:ring-[var(--color-astraprimary)]"
                      />
                      <span>Yes</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        id="anonymous-no"
                        name="anonymous"
                        value="no"
                        checked={isAnonymous === false}
                        onChange={() => setIsAnonymous(false)}
                        className="h-4 w-4 text-[var(--color-astraprimary)] bg-white border border-astralightgray-300 rounded focus:ring-[var(--color-astraprimary)]"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Summary + Donate Button */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-medium">Your Donation</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(amount)}
                </p>
              </div>

              <button
                onClick={handleDonate}
                className="w-full bg-[var(--color-astraprimary)] hover:bg-opacity-90 text-astrawhite py-3 rounded-md text-sm font-semibold transition"
              >
                Donate now
              </button>
            </>
          ) : (
            <div
              className="mt-4 p-4 rounded-md bg-muted text-muted-foreground border border-border text-sm"
            >
              This project{" "}
              {!projectData || projectData.requestStatus === REQUEST_STATUS.REJECTED
                ? "does not exist."
                : projectData.requestStatus === REQUEST_STATUS.SENT
                  ? "is still pending for approval."
                  : projectData.projectStatus === PROJECT_STATUS.FINISHED
                    ? "has already ended."
                    : ""}
            </div>
          )}
      </div>
    </div>
  );
}
