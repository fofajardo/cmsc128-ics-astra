const fetchAllDegreePrograms = async (supabase, userId) => {
  const query = supabase
    .from("degree_programs")
    .select("*");

  return await (userId
    ? query.eq("user_id", userId)
    : query);
};

const fetchDegreeProgramById = async (supabase, id) => {
  return await supabase
    .from("degree_programs")
    .select("*")
    .eq("id", id)
    .single();
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

const fetchAlumniByYearGraduated = async (supabase, yearGraduated) => {
  return await supabase
    .from("degree_programs")
    .select("*")
    .eq("year_graduated", yearGraduated);
};

const degreeProgramService = {
  fetchAllDegreePrograms,
  fetchDegreeProgramById,
  insertDegreeProgram,
  updateDegreeProgramById,
  deleteDegreeProgramById,
  fetchAlumniByYearGraduated,
};

export default degreeProgramService;