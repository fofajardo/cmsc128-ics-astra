"use client";
import { useState, useEffect, useContext} from "react";
import {TableHeader, Table, PageTool} from "@/components/TableBuilder";
import { useTab } from "../../components/TabContext";
import SearchFilter from "./filter";
import { ActionButton } from "@/components/Buttons";
import ToastNotification from "@/components/ToastNotification";
import { Check, Eye } from "lucide-react";
import axios from "axios";
import { TabContext } from "../../components/TabContext";
import ConfirmationPrompt from "@/components/jobs/edit/confirmation";
import { formatDate } from "@/utils/format";
import { DONATION_MODE_OF_PAYMENT, DONATION_MODE_OF_PAYMENT_LABELS } from "@/constants/donationConsts";
import { useSignedInUser } from "@/components/UserContext";

export default function Donations() {
  const user = useSignedInUser();
  const user_id = user.state.user?.id;
  const [showPrompt, setPrompt] = useState(false);
  const [donationToApprove, setDonationToApprove] = useState(null);
  const {setDonationCounts} = useContext(TabContext);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { currTab, info } = useTab();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations`);
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
    fetchDonations();
  }, []);

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
      (donation) => info.currTab === "All" || donation.is_verified === false
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
      const verifiedStatus = donation.is_verified;
      if (verifiedStatus) {
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

      console.log(`${donationModeOfPayment} === ${parsedModeOfPayment}`);

      return (
        matchesDonor &&
        matchesProjectTitle &&
        matchesFromDate &&
        matchesToDate &&
        matchesModeOfPayment &&
        matchesFromAmount &&
        matchesToAmount
      );
    });

    const filteredDonationsByStatus = getDonationsByStatus(filtered);

    setFilteredDonations(filteredDonationsByStatus);
  };

  const handleApprove = async () => {
    if (!donationToApprove?.id) {
      console.error("No donation selected for deletion.");
      return;
    }

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/donations/${donationToApprove.id}`, { is_verified: true, verified_by_user_id: user_id });
      // console.log(response.data);
      if (response.data.status === "UPDATED") {
        console.log("Successfully deleted");
        fetchDonations();
        setToast({ type: "success", message: "Donation successfully approved." });
        setPrompt(false);
        setDonationToApprove(null);
      } else {
        console.error("Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
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
          <Table cols={cols} data={createRows(selectedIds, setSelectedIds, currTab, paginatedDonations, setPrompt, setDonationToApprove)} />
          <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
        <div className="flex flex-row justify-between md:pl-4 lg:pl-8">
          {/* <ActionButton label="Reset Selection" color = "blue" onClick={() => setSelectedIds([])}/> */}
          {/* <BottomButtons selectedCount={selectedIds.length} currTab={currTab} setToast={setToast}/> */}
        </div>
      </div>
      {showPrompt && (
        <ConfirmationPrompt
          prompt="Are you sure you want to approve this donation?"
          close={() => setPrompt(false)}
          handleConfirm={handleApprove}
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

function createRows(selectedIds, setSelectedIds, currTab, filteredDonations, setPrompt, setDonationtoApprove) {
  return filteredDonations.map((donation) => ({
    "Donor": renderDonor(donation.donor),
    "Project Title": renderText(donation.project_title),
    "Donation Date": renderText(donation.donation_date),
    // "Reference Number": renderText(donation.reference_num),
    "Mode of Payment": renderModeOfPayment(donation.mode_of_payment),
    "Amount": renderText(donation.amount),
    // "Donated Anonymously": renderIsAnonymous(donation.is_anonymous),
    // "Comment": renderText(donation.comment),
    "Verification Status": renderVerificationStatus(donation.is_verified),
    // "Verifier": renderText(donation.verified_by_user_id),
    // "Updated At": renderUpdatedAt(donation.updated_at),
    "Quick Actions": renderActions(donation.id, donation.donor, donation.is_verified, currTab, setPrompt, setDonationtoApprove),
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

function renderVerificationStatus(bool) {
  const text = bool ? "Verified" : "Unverified";
  return <div className={`text-center ${text === "Unverified" ? "text-astrared" : "text-astragreen"} font-s`}>{text}</div>;
}

function renderActions(id, name, isVerified, currTab, setPrompt, setDonationToApprove) {
  const confirmApprove = () => {
    setDonationToApprove({id});
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
      {!isVerified ? (
        <>
          <div className="hidden md:block">
            <ActionButton
              label="Approve"
              color="green"
              onClick={confirmApprove}
              notifyMessage={`${name} has been deleted!`}
              notifyType="fail"
            />
          </div>
          <div className="block md:hidden">
            <ActionButton
              label={<Check size={20}/>}
              color="green"
              onClick={confirmApprove}
              notifyMessage={`${name} has been deleted!`}
              notifyType="fail"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}