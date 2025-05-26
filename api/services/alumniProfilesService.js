import { applyFilter, applyArrayFilter, applyArraySearch, applyPagination } from "../utils/filters.js";

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
const fuseThreshold = 0.3; // Adjust this value (0-1) for more/less strict matching
const fuseOptions = {
  keys: [
    "first_name",
    "middle_name",
    "last_name",
    "full_name",
    "email",
    "student_num"
  ],
  threshold: fuseThreshold,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2
};

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

const fetchAlumniSearch = async (supabase, page = 1, limit = 10, search = "", filters = {}) => {
  const { data, error } = await supabase.rpc("fetch_alumni_with_degrees");

  if (error) throw error;

  let filteredData = data;
  filteredData = applyArraySearch(filteredData, search, fuseOptions);
  filteredData = applyArrayFilter(filteredData, filters);
  
  // Before pagination, ensure emails are present by fetching them if needed
  if (filteredData.length > 0 && !filteredData[0].email) {
    const alumIds = filteredData.map(alumni => alumni.alum_id);
    
    // Get emails from users table
    const { data: users, error: usersError } = await supabase
      .from('users')  // Adjust table name as needed
      .select('id, email')
      .in('id', alumIds);
    
    if (!usersError && users) {
      // Create a mapping of user IDs to emails
      const emailMap = {};
      users.forEach(user => {
        emailMap[user.id] = user.email;
      });
      
      // Add the emails to the data
      filteredData = filteredData.map(alumni => ({
        ...alumni,
        email: emailMap[alumni.alum_id] || null
      }));
    }
  }
  
  const paginatedData = applyPagination(filteredData, page, limit);

  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    totalPages: Math.ceil(filteredData.length / limit)
  };
};

const fetchAlumniProfileById = async (supabase, userId) => {
  return await supabase
    .from("alumni_profiles")
    .select(kAlumniProfileSelectQuery)
    .eq("alum_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single(); // In case of duplicates, fetch latest created alumni profile
};

const fetchAlumniProfilesByFilter = async (supabase, filters) => {
  let query = supabase
    .from("alumni_profiles")
    .select("*");

  query = applyFilter(query, filters, {
    ilike: [],
    range: {},
    sortBy: "created_at",
    defaultOrder: "desc",
    specialKeys: []
  });

  return await query;
};

const insertAlumniProfile = async (supabase, alumniProfileData) => {
  return await supabase
    .from("alumni_profiles")
    .insert(alumniProfileData);
};

const approveAlumniProfiles = async (supabase, alumIds) => {
  const updatedProfiles = [];

  if (alumIds.length === 0) {
    // Fetch all unapproved profiles
    const { data: allUnapproved, error: fetchError } = await supabase
      .from("alumni_profiles")
      .select("*")
      .eq("approved", false);

    if (fetchError) {
      throw new Error(`Error fetching unapproved profiles: ${fetchError.message}`);
    }

    // Group by alum_id and select latest (by created_at)
    const latestMap = {};

    for (const profile of allUnapproved) {
      const existing = latestMap[profile.alum_id];

      if (!existing || new Date(profile.created_at) > new Date(existing.created_at)) {
        latestMap[profile.alum_id] = profile;
      }
    }

    for (const profile of Object.values(latestMap)) {
      const { id, created_at, ...newProfile } = profile;
      newProfile.approved = true;
      updatedProfiles.push(newProfile);
    }

  } else {
    // Specific approval
    for (const alumId of alumIds) {
      const { data: profiles, error: fetchError } = await supabase
        .from("alumni_profiles")
        .select("*")
        .eq("alum_id", alumId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        throw new Error(`Error fetching profile for alum_id ${alumId}: ${fetchError.message}`);
      }

      const latestProfile = profiles[0];

      if (!latestProfile) {
        throw new Error(`No profile found for alum_id ${alumId}`);
      }

      const { id, created_at, ...newProfile } = latestProfile;
      newProfile.approved = true;
      updatedProfiles.push(newProfile);
    }
  }

  const { data: insertResult, error: insertError } = await supabase
    .from("alumni_profiles")
    .insert(updatedProfiles);

  if (insertError) {
    throw new Error(`Error inserting approved profiles: ${insertError.message}`);
  }

  return {
    success: true
  };
};

const removeAlumniProfiles = async (supabase, alumIds) => {
  const updatedProfiles = [];

  if (alumIds.length === 0) {
    // Fetch all unapproved profiles
    const { data: allUnapproved, error: fetchError } = await supabase
      .from("alumni_profiles")
      .select("*")
      .eq("approved", true);

    if (fetchError) {
      throw new Error(`Error fetching unapproved profiles: ${fetchError.message}`);
    }

    // Group by alum_id and select latest (by created_at)
    const latestMap = {};

    for (const profile of allUnapproved) {
      const existing = latestMap[profile.alum_id];

      if (!existing || new Date(profile.created_at) > new Date(existing.created_at)) {
        latestMap[profile.alum_id] = profile;
      }
    }

    for (const profile of Object.values(latestMap)) {
      const { id, created_at, ...newProfile } = profile;
      newProfile.approved = false;
      updatedProfiles.push(newProfile);
    }

  } else {
    // Specific approval
    for (const alumId of alumIds) {
      const { data: profiles, error: fetchError } = await supabase
        .from("alumni_profiles")
        .select("*")
        .eq("alum_id", alumId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        throw new Error(`Error fetching profile for alum_id ${alumId}: ${fetchError.message}`);
      }

      const latestProfile = profiles[0];

      if (!latestProfile) {
        throw new Error(`No profile found for alum_id ${alumId}`);
      }

      const { id, created_at, ...newProfile } = latestProfile;
      newProfile.approved = false;
      updatedProfiles.push(newProfile);
    }
  }

  const { data: insertResult, error: insertError } = await supabase
    .from("alumni_profiles")
    .insert(updatedProfiles);

  if (insertError) {
    throw new Error(`Error inserting approved profiles: ${insertError.message}`);
  }

  return {
    success: true
  };
};

const reactivateAlumniProfiles = async (supabase, alumIds) => {
  const updatedProfiles = [];

  if (alumIds.length === 0) {
    // Fetch all unapproved profiles
    const { data: allUnapproved, error: fetchError } = await supabase
      .from("alumni_profiles")
      .select("*")
      .eq("approved", true);

    if (fetchError) {
      throw new Error(`Error fetching unapproved profiles: ${fetchError.message}`);
    }

    // Group by alum_id and select latest (by created_at)
    const latestMap = {};

    for (const profile of allUnapproved) {
      const existing = latestMap[profile.alum_id];

      if (!existing || new Date(profile.created_at) > new Date(existing.created_at)) {
        latestMap[profile.alum_id] = profile;
      }
    }

    for (const profile of Object.values(latestMap)) {
      const { id, created_at, ...newProfile } = profile;
      updatedProfiles.push(newProfile);
    }

  } else {
    // Specific approval
    for (const alumId of alumIds) {
      const { data: profiles, error: fetchError } = await supabase
        .from("alumni_profiles")
        .select("*")
        .eq("alum_id", alumId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        throw new Error(`Error fetching profile for alum_id ${alumId}: ${fetchError.message}`);
      }

      const latestProfile = profiles[0];

      if (!latestProfile) {
        throw new Error(`No profile found for alum_id ${alumId}`);
      }

      const { id, created_at, ...newProfile } = latestProfile;
      updatedProfiles.push(newProfile);
    }
  }

  const { data: insertResult, error: insertError } = await supabase
    .from("alumni_profiles")
    .insert(updatedProfiles);

  if (insertError) {
    throw new Error(`Error inserting approved profiles: ${insertError.message}`);
  }

  return {
    success: true
  };
};

const updateAlumniProfileData = async (supabase, userId, updateData) => {
  const { data: latestProfile, error: selectError } = await supabase
    .from("alumni_profiles")
    .select("id")
    .eq("alum_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (selectError || !latestProfile) {
    throw new Error("Failed to fetch the latest alumni profile.");
  }

  const { error: updateError } = await supabase
    .from("alumni_profiles")
    .update(updateData)
    .eq("id", latestProfile.id);

  if (updateError) {
    throw new Error("Failed to update the alumni profile.");
  }

  return true;
};

const deleteAlumniProfileData = async (supabase, userId) => {
  return await supabase
    .from("alumni_profiles")
    .delete()
    .eq("alum_id", userId);
};

const alumniService = {
  fetchAlumniProfiles,
  fetchAlumniSearch,
  fetchAlumniProfileById,
  fetchAlumniProfilesByFilter,
  insertAlumniProfile,
  approveAlumniProfiles,
  removeAlumniProfiles,
  reactivateAlumniProfiles,
  updateAlumniProfileData,
  deleteAlumniProfileData
};

export default alumniService;