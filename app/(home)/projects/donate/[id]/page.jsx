"use client";

import { useState, useEffect } from "react";
import { useParams,useSearchParams } from "next/navigation";
import Throbber from "../../../../components/projects/Throbber";
import DonationSuccess from "../../../../components/projects/DonationSuccess";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { DONATION_MODE_OF_PAYMENT, PROJECT_STATUS, REQUEST_STATUS } from "../../../../../common/scopes";
import { useSignedInUser } from "@/components/UserContext";
import { formatCurrency } from "@/utils/format";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
        console.log(projectData);
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
          console.error("Unexpected response: ", projectData);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectRequest();
  }, []);

  const createDonation = async () => {
    try {
      const generatedRefNum = "REF" + uuidv4();

      const data = {
        user_id: user?.state?.user?.id,
        project_id: projectData.id,
        donation_date: new Date().toISOString(),
        reference_num: generatedRefNum,
        mode_of_payment: DONATION_MODE_OF_PAYMENT.BANK_TRANSFER,
        amount: amount,
        is_anonymous: isAnonymous,
        comment: null,  // TODO: Add comment field
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations`, data);
      const donationData = response.data;
      if (donationData.status === "CREATED") {
        console.log("Created donation:", donationData);
      } else {
        console.error("Unexpected response:", donationData);
      }
    } catch (error) {
      console.log("Failed to create donation:", error);
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

                  {paymentMethod === "bank" || paymentMethod === "external" && (
                    <div className="">
                      <h3 className="text-sm font-medium mb-4">Upload your receipt</h3>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setReceipt(e.target.files[0])}
                        className="pl-6 w-full text-sm text-astradarkgray file:py-2 file:px-4 file:rounded-md file:border file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                      />
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
