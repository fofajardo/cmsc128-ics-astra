const kAlumniProfileSelectQuery = `
    *,
    primary_work_experience:work_experiences (
        title,
        field,
        company,
        year_started,
        year_ended,
        salary
    )
`;

const fetchAlumniProfiles = async (supabase, page = 1, limit = 10, userId = null) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;

  const baseQuery = supabase
    .from("alumni_profiles")
    .select(kAlumniProfileSelectQuery)
    .range(startIndex, endIndex);

  return await (userId
    ? baseQuery.eq("alum_id", userId)
    : baseQuery);
};

const fetchAlumniProfileById = async (supabase, userId) => {
  return await supabase
    .from("alumni_profiles")
    .select(kAlumniProfileSelectQuery)
    .eq("alum_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();    // In case of duplicates, fetch latest created alumni profile
};

const insertAlumniProfile = async (supabase, alumniProfileData) => {
  return await supabase
    .from("alumni_profiles")
    .insert(alumniProfileData);
};

const updateAlumniProfileData = async (supabase, userId, updateData) => {
  return await supabase
    .from("alumni_profiles")
    .update(updateData)
    .eq("alum_id", userId);
};

const deleteAlumniProfileData = async (supabase, userId) => {
  return await supabase
    .from("alumni_profiles")
    .delete()
    .eq("alum_id", userId);
};

const alumniService = {
  fetchAlumniProfiles,
  fetchAlumniProfileById,
  insertAlumniProfile,
  updateAlumniProfileData,
  deleteAlumniProfileData
};

export default alumniService;