const fetchAlumniProfiles = async (supabase, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit) - 1;

    return await supabase
        .from("alumni_profiles")
        .select("*")
        .range(startIndex, endIndex);
};

const fetchAlumniProfileById = async (supabase, userId) => {
    return await supabase
        .from("alumni_profiles")
        .select("*")
        .eq("alum_id", userId)
        .single();
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
}

const fetchUserById = async (supabase, userId) => {
    return await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
};

const alumniService = {
    fetchAlumniProfiles,
    fetchAlumniProfileById,
    insertAlumniProfile,
    updateAlumniProfileData,
    deleteAlumniProfileData,
    fetchUserById // added function to fetch user by ID
};

export default alumniService;