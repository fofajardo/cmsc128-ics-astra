const fetchProjects = async (supabase, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit) - 1;

    return await supabase
        .from("projects")
        .select()
        .range(startIndex, endIndex);
};

const fetchProjectById = async (supabase, projectId) => {
    return await supabase
        .from("projects")
        .select("*")
        .eq("project_id", projectId)
        .single();
};

const insertProject = async (supabase, projectData) => {
    return await supabase
        .from("projects")
        .insert(projectData);
};

const updateProjectData = async (supabase, projectId, updateData) => {
    return await supabase
        .from("projects")
        .update(updateData)
        .eq("project_id", projectId);
};

const deleteProject = async (supabase, projectId) => {
    return await supabase
        .from("projects")
        .delete()
        .eq("project_id", projectId);
}

const projectsService = {
    fetchProjects,
    fetchProjectById,
    insertProject,
    updateProjectData,
    deleteProject
};

export default projectsService;