import { applyFilter } from "../utils/filters.js";

/*
Format /work_experiences?query_key=query_value&query2_key=query2_value&...

Valid query_keys:
alum_id
title
field
company
year_started
from_year_started
to_year_started
year_ended
from_year_ended
to_year_ended
sort_by
order
*/
const fetchWorkExperiences = async (supabase, filters) => {
  let query = supabase
    .from("work_experiences")
    .select("*");

  // TO DO: Implement filter correction for date ranges
  // in the utils folder
  if (filters.from_year_started) {
    filters.from_year_started = `${filters.from_year_started}-01-01`;
  }
  if (filters.to_year_started) {
    filters.to_year_started = `${filters.to_year_started}-12-31`;
  }

  if (filters.from_year_ended) {
    filters.from_year_ended = `${filters.from_year_ended}-01-01`;
  }
  if (filters.to_year_ended) {
    filters.to_year_ended = `${filters.to_year_ended}-12-31`;
  }

  query = applyFilter(query, filters, {
    ilike: ["title"],
    range: {
      year_started: [filters.from_year_started, filters.to_year_started],
      year_ended: [filters.from_year_ended, filters.to_year_ended]
    },
    sortBy: "year_started",
    defaultOrder: "asc",
    specialKeys: [
      "from_year_started",
      "to_year_started",
      "from_year_ended",
      "to_year_ended"
    ]
  });

  return await query;
};

const fetchWorkExperienceById = async (supabase, workExperienceId) => {
  return await supabase
    .from("work_experiences")
    .select("*")
    .eq("id", workExperienceId)
    .single();
};

const fetchWorkExperiencesByAlumId = async (supabase, userId) => {
  return await supabase
    .from("work_experiences")
    .select("*")
    .eq("user_id", userId)
    .order("is_current", { ascending: false })
    .order("year_started", { ascending: false });
};

const fetchDistinctFields = async (supabase) => {
  return await supabase
    .from("distinct_work_fields")
    .select("*");
};

const insertWorkExperience = async (supabase, workExperienceData) => {
  return await supabase
    .from("work_experiences")
    .insert(workExperienceData)
    .select("*");
};

const updateWorkExperience = async (supabase, workExperienceId, updateData) => {
  return await supabase
    .from("work_experiences")
    .update(updateData)
    .eq("id", workExperienceId);
};

const deleteWorkExperience = async (supabase, workExperienceId) => {
  return await supabase
    .from("work_experiences")
    .delete()
    .eq("id", workExperienceId);
};

const workExperiencesService = {
  fetchWorkExperiences,
  fetchWorkExperienceById,
  fetchWorkExperiencesByAlumId,
  fetchDistinctFields,
  insertWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
};

export default workExperiencesService;