"use client";
import { useState, useEffect, useContext} from "react";
import {TableHeader, Table, PageTool} from "@/components/TableBuilder";
import { useTab } from "../../components/TabContext";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import ToastNotification from "@/components/ToastNotification";
import { Check, Eye, X } from "lucide-react";
import axios from "axios";
import { TabContext } from "../../components/TabContext";
import ConfirmationPrompt from "@/components/jobs/edit/confirmation";
import { formatDate } from "@/utils/format";
import { DONATION_MODE_OF_PAYMENT_LABELS } from "../../../common/scopes";
import { useSignedInUser } from "@/components/UserContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Donations() {
  const user = useSignedInUser();
  const user_id = user.state.user?.id;
  const [showPrompt, setPrompt] = useState(false);
  const [donationToApprove, setDonationToApprove] = useState(null);
  const [donationToDecline, setDonationToDecline] = useState(null);
  const {setDonationCounts} = useContext(TabContext);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [paginatedDonations, setPaginatedDonations] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const toggleFilter = () => {
    console.log("Toggling filter modal:", !showFilter);
    setShowFilter((prev) => !prev);
  };

  const [pagination, setPagination] = useState({
    display: [1, itemsPerPage],
    currPage: 1,
    lastPage: 1,
    numToShow: itemsPerPage,
    total: 0,
    itemsPerPage
  });

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations`, {
        params: {
          requester_id: user_id,
        }
      });
      console.log(response.data);
      if (response.data.status === "OK") {
        setDonations(response.data.donations || []);
        computeCounts(response.data.donations || []);
      } else {
        console.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Failed to fetch donations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.state.user?.id) {
      fetchDonations();
    }
  }, [user]);

  useEffect(() => {
    const sortedDonations = donations.sort((a, b) => {
      return new Date(a.donation_date) - new Date(b.donation_date);
    });
    const filteredDonationsByStatus = getDonationsByStatus(sortedDonations);
    setFilteredDonations(filteredDonationsByStatus);
  }, [donations]);

  useEffect(() => {
    const total = filteredDonations.length;
    const lastPage = Math.max(1, Math.ceil(total / itemsPerPage));

    setPagination({
      display: [1, Math.min(itemsPerPage, total)],
      currPage: 1,
      lastPage,
      numToShow: itemsPerPage,
      total,
      itemsPerPage
    });
  }, [filteredDonations, searchQuery]);

  useEffect(() => {
    const start = (pagination.currPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    setPaginatedDonations(filteredDonations.slice(start, end));
  }, [filteredDonations, pagination.currPage, pagination.itemsPerPage, info]);

  useEffect(() => {
    const filteredDonationsByStatus = getDonationsByStatus(donations);
    setFilteredDonations(filteredDonationsByStatus);
  }, [info]);

  const getDonationsByStatus = (donations) => {
    return donations.filter(
      (donation) => info.currTab === "All" || donation.is_verified === false && !donation.deleted_at
    );
  };

  const handleSearch = (searchInput) => {
    const lower = (searchInput || "").toLowerCase();
    const filteredDonationsByStatus = getDonationsByStatus(donations);
    const filtered = filteredDonationsByStatus.filter(donation =>
      (donation.donor).toLowerCase().includes(lower) ||
      (donation.project_title).toLowerCase().includes(lower)
    );

    setSearchQuery(searchInput);
    setFilteredDonations(filtered);
  };

  const computeCounts = (list) => {
    let verified = 0;
    let unverified = 0;

    for (const donation of list) {
      const isDeleted = donation.deleted_at;
      const verifiedStatus = donation.is_verified;
      if (isDeleted) {
        // Do not count deleted donations
        continue;
      } else if (verifiedStatus) {
        verified++;
      } else {
        unverified++;
      }
    }
    let total_count = verified + unverified;
    setDonationCounts({ verified: verified, unverified: unverified, total: total_count });
  };

  const handleApply = (filters = {}) => {
    const {
      donor = "",
      projectTitle = "",
      fromDate = "",  // TODO filtering by date range
      toDate = "",
      modeOfPayment = "",
      fromAmount = "",
      toAmount = "",
      verificationStatus = "",
      // sortCategory = "", // TODO sorting
      // sortOrder = "asc",
    } = filters;

    const lowerDonor = donor.toLowerCase();
    const lowerProjectTitle = projectTitle.toLowerCase();
    const parsedFromDate = new Date(fromDate);
    const parsedToDate = new Date(toDate);
    const parsedModeOfPayment = modeOfPayment ? modeOfPayment : null;
    const parsedFromAmount = parseInt(fromAmount);
    const parsedToAmount = parseInt(toAmount);

    const filtered = donations.filter(donation => {
      const donationDonor = (donation.donor || "").toLowerCase();
      const donationProjectTitle = (donation.project_title || "").toLowerCase();
      const donationDonationDate = new Date(donation.donation_date);
      const donationModeOfPayment = DONATION_MODE_OF_PAYMENT_LABELS[donation.mode_of_payment];
      const donationAmount = Number(donation.amount);
      const matchesDonor = !lowerDonor || donationDonor.includes(lowerDonor);
      const matchesProjectTitle = !lowerProjectTitle || donationProjectTitle.includes(lowerProjectTitle);
      const matchesFromDate = isNaN(parsedFromDate) || donationDonationDate >= parsedFromDate;
      const matchesToDate = isNaN(parsedToDate) || donationDonationDate <= parsedToDate;
      const matchesModeOfPayment = parsedModeOfPayment === null  || donationModeOfPayment === parsedModeOfPayment;
      const matchesFromAmount = isNaN(parsedFromAmount) || donationAmount >= parsedFromAmount;
      const matchesToAmount = isNaN(parsedToAmount) || donationAmount <= parsedToAmount;
      const matchesVerificationStatus = !verificationStatus ||
        (verificationStatus === "deleted" && donation.deleted_at) ||
        (verificationStatus === "verified" && donation.is_verified) ||
        (verificationStatus === "unverified" && !donation.is_verified);

      console.log(`${donationModeOfPayment} === ${parsedModeOfPayment}`);

      return (
        matchesDonor &&
        matchesProjectTitle &&
        matchesFromDate &&
        matchesToDate &&
        matchesModeOfPayment &&
        matchesFromAmount &&
        matchesToAmount &&
        matchesVerificationStatus
      );
    });

    const filteredDonationsByStatus = getDonationsByStatus(filtered);

    setFilteredDonations(filteredDonationsByStatus);
  };

  const handleApprove = async () => {
    if (!donationToApprove?.id) {
      console.error("No donation selected for approval.");
      return;
    }

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations/${donationToApprove.id}`, { is_verified: true, verified_by_user_id: user_id });
      if (response.data.status === "UPDATED") {
        // console.log("Successfully approved");
        fetchDonations();
        setToast({ type: "success", message: "Donation successfully approved." });
        setPrompt(false);
        setDonationToApprove(null);
      } else {
        console.error("Failed to approve donation.");
      }
    } catch (error) {
      console.error("Error approving donation:", error);
    }
  };

  const handleDecline = async () => {
    if (!donationToDecline?.id) {
      console.error("No donation selected for reject.");
      return;
    }

    try {
      console.log(user_id);
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations/${donationToDecline.id}`, { data: { verified_by_user_id: user_id }});
      if (response.data.status === "DELETED") {
        // console.log("Successfully rejected");
        fetchDonations();
        setToast({ type: "success", message: "Donation successfully rejected." });
        setPrompt(false);
        setDonationToDecline(null);
      } else {
        console.error("Failed to decline reject.");
      }
    } catch (error) {
      console.error("Error rejecting donation:", error);
    }
  };

  return (
    <div>
      {/* Filter Modal */}
      {showFilter && (
        <div
          onClick={toggleFilter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div onClick={e => e.stopPropagation()}>
            <SearchFilter onClose={toggleFilter} onApply={handleApply}/>
          </div>
        </div>
      )}

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Table section */}
      <div className="bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24 flex flex-col">
        <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
          <TableHeader info={info} pagination={pagination} setPagination={setPagination} toggleFilter={toggleFilter} setSearchQuery={handleSearch} searchQuery={searchQuery} />
          {loading ? (
            <div className="bg-astrawhite p-6 rounded-b-xl flex items-center justify-center">
              <LoadingSpinner className="h-10 w-10" />
            </div>
          ) :
            <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab, paginatedDonations, setPrompt, setDonationToApprove, setDonationToDecline)} />}
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
        <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
          {/* <ActionButton label="Reset Selection" color = "blue" onClick={() => setSelectedIds([])}/> */}
          {/* <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast}/> */}
        </div>
      </div>
      {showPrompt && (
        <ConfirmationPrompt
          prompt={donationToApprove ? "Are you sure you want to approve this donation?" : "Are you sure you want to reject this donation?"}
          close={() => {
            setDonationToApprove(null);
            setDonationToDecline(null);
            setPrompt(false);
          }
          }
          handleConfirm={donationToApprove ? handleApprove : handleDecline}
        />
      )}
    </div>
  );
}

const cols = [
  { label: "Donor", justify: "start", visible: "all" },
  { label: "Project Title", justify: "center", visible: "sm" },
  { label: "Donation Date", justify: "center", visible: "sm" },
  // { label: "Reference Number", justify: "center", visible: "sm" },
  { label: "Mode of Payment", justify: "center", visible: "sm" },
  { label: "Amount", justify: "center", visible: "sm" },
  // { label: "Donated Anonymously", justify: "center", visible: "sm" },
  // { label: "Comment", justify: "center", visible: "sm" },
  { label: "Verification Status", justify: "center", visible: "sm" },
  // { label: "Verifier", justify: "center", visible: "sm" },
  // { label: "Updated At", justify: "center", visible: "sm" },
  { label: "Quick Actions", justify: "center", visible: "all" },
];

function createRows(selectedIds, setSelectedIds, currTab, filteredDonations, setPrompt, setDonationToApprove, setDonationToDecline) {
  return filteredDonations.map((donation) => ({
    "Donor": renderDonor(donation.donor),
    "Project Title": renderText(donation.project_title),
    "Donation Date": renderText(donation.donation_date),
    // "Reference Number": renderText(donation.reference_num),
    "Mode of Payment": renderModeOfPayment(donation.mode_of_payment),
    "Amount": renderText(donation.amount),
    // "Donated Anonymously": renderIsAnonymous(donation.is_anonymous),
    // "Comment": renderText(donation.comment),
    "Verification Status": renderVerificationStatus(donation.deleted_at, donation.is_verified),
    // "Verifier": renderText(donation.verified_by_user_id),
    // "Updated At": renderUpdatedAt(donation.updated_at),
    "Quick Actions": renderActions(donation.id, donation.donor, donation.is_verified, donation.deleted_at, currTab, setPrompt, setDonationToApprove, setDonationToDecline),
  }));
}

function renderDonor(name) {
  return (
    <div>
      <div className="font-s font-semibold py-5 pl-2 ">{name}</div>
    </div>
  );
}

function renderUpdatedAt(updated_at) {
  return (
    <div>
      <div className="font-s font-semibold py-5 pl-2 ">{formatDate(updated_at, "complete")}</div>
    </div>
  );
}

function renderModeOfPayment(mode_of_payment) {
  return <div className={"text-center font-s"}>{DONATION_MODE_OF_PAYMENT_LABELS[mode_of_payment]}</div>;
}

function renderText(text) {
  return <div className="text-center text-astradarkgray font-s">{text}</div>;
}

function renderIsAnonymous(bool) {
  const text = bool ? "Yes" : "No";
  return <div className={"text-center font-s"}>{text}</div>;
}

function renderVerificationStatus(deleted, verified) {
  const isDeleted = deleted !== null;
  const text = isDeleted ? "Deleted" : verified ? "Verified" : "Unverified";
  return <div className={`text-center ${text === "Unverified" || text === "Deleted" ? "text-astrared" : "text-astragreen"} font-s`}>{text}</div>;
}

function renderActions(id, name, isVerified, deleted, currTab, setPrompt, setDonationToApprove, setDonationToDecline) {
  const isDeleted = deleted !== null;

  const confirmApprove = () => {
    setDonationToApprove({id});
    setPrompt(true);
  };

  const confirmDecline = () => {
    setDonationToDecline({id});
    setPrompt(true);
  };

  return (
    <div className="flex justify-center gap-3 md:pr-4 lg:pr-2">
      <div className="hidden md:block">
        <ActionButton
          label="View"
          color="gray"
          route={`/admin/donations/${id}/view`}
        />
      </div>
      <div className="block md:hidden">
        <ActionButton
          label={<Eye size={20}/>}
          color="gray"
          route={`/admin/donations/${id}/view`}
        />
      </div>
      {!isVerified && !isDeleted ? (
        <>
          <div className="hidden md:block">
            <ActionButton
              label="Approve"
              color="green"
              onClick={confirmApprove}
              notifyMessage={`${name} has been approved!`}
              notifyType="success"
            />
          </div>
          <div className="block md:hidden">
            <ActionButton
              label={<Check size={20}/>}
              color="green"
              onClick={confirmApprove}
              notifyMessage={`${name} has been approved!`}
              notifyType="success"
            />
          </div>
          <div className="hidden md:block">
            <ActionButton
              label="Reject"
              color="red"
              onClick={confirmDecline}
              notifyMessage={`${name} has been rejected!`}
              notifyType="fail"
            />
          </div>
          <div className="block md:hidden">
            <ActionButton
              label={<X size={20}/>}
              color="red"
              onClick={confirmDecline}
              notifyMessage={`${name} has been rejected!`}
              notifyType="fail"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}