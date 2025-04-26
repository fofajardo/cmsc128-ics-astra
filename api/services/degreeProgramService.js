import { applyFilter } from "../utils/applyFilter.js";

const fetchAllDegreePrograms = async (supabase) => {
  return await supabase
    .from("degree_programs")
    .select("*");
};

const fetchDegreeProgramById = async (supabase, id) => {
  return await supabase
    .from("degree_programs")
    .select("*")
    .eq("id", id)
    .single();
};

const fetchDegreeProgramsByUserId = async (supabase, userId, filters) => {
    // TODO: Add filters
    return await supabase
        .from("degree_programs")
        .select("*")
        .sort("year_graduated", { ascending: false })
        .eq("user_id", userId)
};

const insertDegreeProgram = async (supabase, degreeProgramData) => {
  return await supabase
    .from("degree_programs")
    .insert(degreeProgramData)
    .select();
};

const updateDegreeProgramById = async (supabase, id, updateData) => {
  return await supabase
    .from("degree_programs")
    .update(updateData)
    .eq("id", id)
    .select();
};

const deleteDegreeProgramById = async (supabase, id) => {
  return await supabase
    .from("degree_programs")
    .delete()
    .eq("id", id);
};

const degreeProgramService = {
  fetchAllDegreePrograms,
  fetchDegreeProgramById,
  fetchDegreeProgramsByUserId,
  insertDegreeProgram,
  updateDegreeProgramById,
  deleteDegreeProgramById,
};

export default degreeProgramService;