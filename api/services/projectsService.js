import { applyFilter } from "../utils/applyFilter.js";

/*
Format /projects?query_key=query_value&query2_key=query2_value&...

Valid query_keys:
project_id
status
due_date
date_completed
goal_amount
donation_link
min_goal
max_goal
sort_by
order
*/
const fetchProjects = async (supabase, filters) => {
    let query = supabase
        .from('project_donation_summary')
        .select('*');

  query = applyFilter(query, filters, {
    ilike: ["donation_link"],
    range: {
      // due_date: [filters.from_due_date, filters.to_due_date],
      goal_amount: [filters.min_goal, filters.max_goal]       // e.g. /projects?min_goal=35000&max_goal=50000
    },
    sortBy: "due_date",
    defaultOrder: "asc",
    specialKeys: [
      // 'from_due_date',
      // 'to_due_date',
      "min_goal",
      "max_goal"
    ]
  });

  return await query;
};

const fetchProjectById = async (supabase, projectId) => {
    return await supabase
        .from('project_donation_summary')
        .select('*')
        .eq('project_id', projectId)
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
};

const projectsService = {
  fetchProjects,
  fetchProjectById,
  insertProject,
  updateProjectData,
  deleteProject
};

export default projectsService;