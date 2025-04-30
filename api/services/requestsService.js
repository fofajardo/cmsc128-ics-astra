import { applyFilter } from "../utils/applyFilter.js";

/*
Format /requests?query_key=query_value&query2_key=query2_value&...

Valid query_keys:
user_id
content_id
type
status
title
description
date_requested
date_reviewed
response
*/

const fetchRequests = async (supabase, filters) => {
  let query = supabase.from("requests").select("*");

  query = applyFilter(query, filters, {
    ilike: ["title", "description"],
    range: {
      date_requested: [filters.from_date_requested, filters.to_date_requested],
      date_reviewed: [filters.from_date_reviewed, filters.to_date_reviewed],
    },
    sortBy: "date_requested",
    defaultOrder: "desc",
    specialKeys: [
      "from_date_requested",
      "to_date_requested",
      "from_date_reviewed",
      "to_date_reviewed",
    ],
  });

  return await query;
};

const fetchRequestById = async (supabase, requestId) => {
  return await supabase
    .from("requests")
    .select("*")
    .eq("id", requestId)
    .single();
};

const fetchRequestsByUserId = async (supabase, userId) => {
  return await supabase
    .from("requests")
    .select("*")
    .eq("user_id", userId);
};

const fetchRequestsByContentId = async (supabase, contentId) => {
  return await supabase
    .from("requests")
    .select("*")
    .eq("content_id", contentId);
};

const insertRequest = async (supabase, requestData) => {
  return await supabase
    .from("requests")
    .insert(requestData)
    .select("*");
};

const updateRequest = async (supabase, requestId, updateData) => {
  return await supabase
    .from("requests")
    .update(updateData)
    .eq("id", requestId);
};

const deleteRequest = async (supabase, requestId) => {
  return await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);
};

const requestsService = {
  fetchRequests,
  fetchRequestById,
  fetchRequestsByUserId,
  fetchRequestsByContentId,
  insertRequest,
  updateRequest,
  deleteRequest
};

export default requestsService;

