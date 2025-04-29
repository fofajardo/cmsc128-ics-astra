import { applyFilter } from "../utils/applyFilter.js";

/*
Format /donations?query_key=query_value&query2_key=query2_value&...

Valid query_keys:
id
alum_id
project_id
donation_date
reference_num
mode_of_payment
amount
comment
is_anonymous
from_donation_date
to_donation_date
min_amount
max_amount
sort_by
order
*/
const fetchDonations = async (supabase, filters) => {
  let query = supabase
    .from("donations")
    .select("*");

  query = applyFilter(query, filters, {
    ilike: ["comment"],
    range: {
      donation_date: [filters.from_donation_date, filters.to_donation_date],
      amount: [filters.min_amount, filters.max_amount]       // e.g. /projects?min_amount=35000&max_amount=50000
    },
    sortBy: "donation_date",
    defaultOrder: "desc",
    specialKeys: [
      "from_donation_date",
      "to_donation_date",
      "min_amount",
      "max_amount"
    ]
  });

  return await query;
};

const fetchDonationById = async (supabase, donationId) => {
  return await supabase
    .from("donations")
    .select("*")
    .eq("id", donationId)
    .single();
};

const insertDonation = async (supabase, donationData) => {
  return await supabase
    .from("donations")
    .insert(donationData)
    .select("id")
    .single();;
};

const updateDonationData = async (supabase, donationId, updateData) => {
  return await supabase
    .from("donations")
    .update(updateData)
    .eq("id", donationId);
};

const deleteDonation = async (supabase, donationId) => {
  return await supabase
    .from("donations")
    .delete()
    .eq("id", donationId);
};

const donationsService = {
  fetchDonations,
  fetchDonationById,
  insertDonation,
  updateDonationData,
  deleteDonation
};

export default donationsService;