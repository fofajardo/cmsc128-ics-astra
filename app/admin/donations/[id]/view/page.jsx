"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Back from "@/components/jobs/view/back";
import { formatDate } from "@/utils/format";
import { DONATION_MODE_OF_PAYMENT, DONATION_MODE_OF_PAYMENT_LABELS, PhotoType } from "../../../../../common/scopes";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Image } from "lucide-react";
// import BigJobCardwDelete from "@/components/jobs/admin/bigJobCardwDelete";
// import SideJobCard from "@/components/jobs/view/sideJobCard";
// import SmallJobCard from "../../../../components/jobs/view/smallJobCard";

export default function ViewDonationIdAdminPage() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiptPhoto, setReceiptPhoto] = useState(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        // Fetch donation data
        const donationResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations/${id}`);
        // console.log("Donation API Response:", donationResponse.data);

        if (donationResponse.data.status === "OK" && donationResponse.data.donation) {
          const donationData = donationResponse.data.donation;
          setDonation(donationData);

          // Fetch project data
          const projectResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${donationData.project_id}`);
          // console.log("Project API Response:", projectResponse.data);
          if (projectResponse.data.status === "OK" && projectResponse.data.project) {
            setProject(projectResponse.data.project);
          }

          // Fetch user data
          const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${donationData.user_id}`);
          // console.log("User API Response:", userResponse.data);
          if (userResponse.data.status === "OK" && userResponse.data.user) {
            setUser(userResponse.data.user);
          }

          // Use our new API endpoint to fetch the donation receipt
          const receiptResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/donation-receipt`,
            {
              params: {
                user_id: donationData.user_id,
                project_id: donationData.project_id
              }
            }
          );

          // console.log("Receipt Response:", receiptResponse.data);

          if (receiptResponse.data.status === "OK" && receiptResponse.data.url) {
            setReceiptPhoto({
              ...receiptResponse.data.photo,
              url: receiptResponse.data.url
            });
          }
        } else {
          setError("Donation not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDonationDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl flex items-center justify-center min-h-screen">
        <LoadingSpinner className="h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-xl">{error}</div>;
  }

  return (
    <div className="py-8 bg-astratintedwhite w-full flex flex-col items-center">
      <Back />

      <div className="flex flex-col md:flex-row justify-between gap-6 max-w-[1250px] w-19/20">
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">{project?.title || "Loading project title..."}</h1>

          {/* Donation Photo Placeholder */}
          {/* Donation Photo */}
          <div className="mb-6 bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
            {receiptPhoto?.url ? (
              <div className="w-full h-full">
                <img
                  src={receiptPhoto.url}
                  alt="Donation Receipt"
                  className="w-full h-full object-contain max-h-[500px]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                    console.error("Error loading image:", receiptPhoto.url);
                  }}
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Receipt uploaded by donor</p>
              </div>
            ) : (
              <>
                <Image className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center">No receipt image available for this donation</p>
              </>
            )}
          </div>

          {/* Donation Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Donor Information</h2>
              <p className="text-gray-600">{user?.email || "Loading donor email..."}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Donation Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-gray-600">₱{donation.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mode of Payment</p>
                  <p className="text-gray-600">{DONATION_MODE_OF_PAYMENT_LABELS[donation.mode_of_payment]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Donation Date</p>
                  <p className="text-gray-600">{formatDate(donation.donation_date, "complete")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <p className={`${donation.is_verified ? "text-astragreen" : "text-astrared"}`}>
                    {donation.is_verified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>
            </div>

            {donation.comment && (
              <div>
                <h2 className="text-lg font-medium text-gray-700">Comment</h2>
                <p className="text-gray-600 mt-2">{donation.comment}</p>
              </div>
            )}
          </div>
        </div>

        {/* Side Information */}
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-gray-600">{donation.reference_num || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Anonymous Donation</p>
              <p className="text-gray-600">{donation.is_anonymous ? "Yes" : "No"}</p>
            </div>

            {donation.verified_by_user_id && (
              <div>
                <p className="text-sm text-gray-500">Verified By</p>
                <p className="text-gray-600">{donation.verified_by_user_id}</p>
              </div>
            )}

            {donation.updated_at && (
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-600">{formatDate(donation.updated_at, "complete")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}