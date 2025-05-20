import { applyFilter } from "../utils/filters.js";

const fetchJobs = async (supabase, filters) => {
  console.log("Supabase:", supabase);

  let query = supabase.from("jobs").select("*");

  query = applyFilter(query, filters, {
    ilike: ["location", "job_title", "hiring_manager", "company_name"],
    range: {
      created_at: [filters.created_at_from, filters.created_at_to],
      salary: [filters.salary_min, filters.salary_max]
    },
    sortBy: filters.sortBy || "created_at",
    defaultOrder: filters.order || "desc",
    specialKeys: [
      "created_at_from", "created_at_to",
      "salary_min", "salary_max",
      "sortBy", "order"
    ]
  });

  return await query;
};

const fetchReportedJobs = async (supabase, filters) => {
  console.log("Supabase:", supabase);

  const { data: reports, error: reportError } = await supabase
    .from("reports")
    .select("content_id");

  if (reportError) {
    console.error(reportError);
    return;
  }

  const reported = reports.map(report => report.content_id).filter(id => id !== null);

  const jobs = await supabase
    .from("jobs")
    .select("*")
    .in("job_id", reported);

  return jobs;
};

const fetchJobById = async (supabase, jobId) => {
  return await supabase
    .from("jobs")
    .select("*")
    .eq("job_id", jobId)
    .single();
};

const checkExistingJob = async (supabase, jobTitle, companyName, location) => {
  return await supabase
    .from("jobs")
    .select("job_id")
    .match({
      job_title: jobTitle,
      company_name: companyName,
      location: location
    });
};

const insertJob = async (supabase, jobData) => {
  return await supabase
    .from("jobs")
    .insert(jobData)
    .select("*")
    .single();
};

const updateJobData = async (supabase, jobId, updateData) => {
  return await supabase
    .from("jobs")
    .update(updateData)
    .eq("job_id", jobId);
};

const deleteJobData = async (supabase, jobId) => {
  return await supabase
    .from("jobs")
    .delete()
    .eq("job_id", jobId);
};

const jobsService = {
  fetchJobs,
  fetchReportedJobs,
  fetchJobById,
  checkExistingJob,
  insertJob,
  updateJobData,
  deleteJobData
};

export default jobsService;