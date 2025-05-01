const fetchActiveAlumniStats = async (supabase) => {
  const { data, error } = await supabase
    .from("active_alumni_stats")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

const fetchActiveJobsStats = async (supabase) => {
  const { data, error } = await supabase
    .from("active_jobs_view")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

const fetchActiveEventsStats = async (supabase) => {
  const { data, error } = await supabase
    .from("active_events_view")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

const fetchFundsRaisedStats = async (supabase) => {
  const { data, error } = await supabase
    .from("funds_raised_view")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

const statisticsService = {
  fetchActiveAlumniStats,
  fetchActiveJobsStats,
  fetchActiveEventsStats,
  fetchFundsRaisedStats
};

export default statisticsService;