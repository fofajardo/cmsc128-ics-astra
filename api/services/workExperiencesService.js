const fetchWorkExperiences = async (supabase, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit) - 1;

    return await supabase
        .from("work_experiences")
        .select("*")
        .range(startIndex, endIndex);
};

const fetchWorkExperienceById = async (supabase, workExperienceId) => {
    return await supabase
        .from("work_experiences")
        .select("*")
        .eq("id", workExperienceId)
        .single();
};

const fetchWorkExperiencesByAlumId = async (supabase, alumId) => {
    return await supabase
        .from("work_experiences")
        .select("*")
        .eq("alum_id", alumId);
};

// const fetchWorkExperienceByOtherColumn = async (supabase, columnName, columnValue) => {
//     if (!["title", "field", "company", "year_started", "year_ended"].includes(columnName)) {
//         throw new Error("Invalid column name provided.");
//     };

//     return await supabase
//         .from("work_experiences")
//         .select("*")
//         .eq(`"${columnName}"`, columnValue);
// }

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
    // fetchWorkExperienceByOtherColumn,
    insertWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
};

export default workExperiencesService;