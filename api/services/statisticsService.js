const fetchAlumniStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_stats")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const fetchActiveAlumniStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_stats")
    .select("active_alumni_count")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const fetchActiveJobsStats = async (supabase) => {
  const { data, error } = await supabase
    .from("active_jobs_view")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const fetchActiveEventsStats = async (supabase) => {
  const { data, error } = await supabase
    .from("active_events_view")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const fetchFundsRaisedStats = async (supabase) => {
  const { data, error } = await supabase
    .from("funds_raised_view")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const fetchUpcomingEvents = async (supabase) => {
  const { data, error } = await supabase
    .from("upcoming_events")
    .select("*");

  if (error) {
    throw error;
  }

  return data;
};

const fetchProjectDonationSummary = async (supabase) => {
  const { data, error } = await supabase
    .from("project_donation_summary")
    .select("*");

  if (error) {
    throw error;
  }

  return data;
};

const fetchAlumniSexStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_sex")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const fetchAlumniAgeStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_age")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const fetchAlumniCivilStatusStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_civil_status")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const fetchAlumniOrgAffiliationStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_org_affiliation")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const fetchAlumniFieldStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_field")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const fetchAlumniHighestDegreeStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_deg_program")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const fetchAlumniIncomeRangeStats = async (supabase) => {
  const { data, error } = await supabase
    .from("alumni_income_range")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const fetchProjectContributors = async (supabase) => {
  const { data, error } = await supabase
    .from("project_contributors")
    .select("*");

  if (error) {
    throw error;
  }
  return data;
};

const statisticsService = {
  fetchAlumniStats,
  fetchActiveAlumniStats,
  fetchActiveJobsStats,
  fetchActiveEventsStats,
  fetchFundsRaisedStats,
  fetchUpcomingEvents,
  fetchProjectDonationSummary,
  fetchAlumniSexStats,
  fetchAlumniAgeStats,
  fetchAlumniCivilStatusStats,
  fetchAlumniOrgAffiliationStats,
  fetchAlumniFieldStats,
  fetchAlumniHighestDegreeStats,
  fetchAlumniIncomeRangeStats,
  fetchProjectContributors
};

export default statisticsService;