import { applyFilter } from "../utils/applyFilter.js";
import Fuse from "fuse.js";

const fuseThreshold = 0.3;

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

const fetchAlumniSearch = async (supabase, page = 1, limit = 10, search = "", filters = {}) => {
  // First get the latest alumni profiles
  const { data: alumniProfiles, error: profilesError } = await supabase
    .from("alumni_profiles")
    .select(`
      id,
      alum_id,
      first_name,
      middle_name,
      last_name,
      location,
      skills,
      created_at,
      primary_work_experience:work_experiences (
        field
      )
    `)
    .order("alum_id")
    .order("created_at", { ascending: false });

  if (profilesError) throw profilesError;

  // Get unique latest profiles
  const uniqueAlumni = [];
  const seenAlumIds = new Set();

  alumniProfiles.forEach(profile => {
    if (!seenAlumIds.has(profile.alum_id)) {
      seenAlumIds.add(profile.alum_id);
      uniqueAlumni.push(profile);
    }
  });

  // Get all degree programs for these alumni
  const { data: degreePrograms, error: degreesError } = await supabase
    .from("degree_programs")
    .select("user_id, year_graduated")
    .in("user_id", uniqueAlumni.map(alum => alum.alum_id));

  if (degreesError) throw degreesError;

  // Combine the data manually
  const combinedData = uniqueAlumni.map(alum => {
    const degrees = degreePrograms.filter(d => d.user_id === alum.alum_id);

    return {
      ...alum,
      year_graduated: degrees[0]?.year_graduated || null,
      field: alum.primary_work_experience?.field || null,
      full_name: `${alum.first_name} ${alum.middle_name ? alum.middle_name + " " : ""}${alum.last_name}`.trim()
    };
  });

  // Apply search filter
  const fuseOptions = {
    keys: [
      "first_name",
      "middle_name",
      "last_name",
      "full_name",
      // "location",
      // "field",
      // "skills",
    ],
    threshold: fuseThreshold, // Adjust this value (0-1) for more/less strict matching
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2 // Minimum characters required for matching
  };

  // Apply fuzzy search if search term exists
  let filteredData = combinedData;
  if (search) {
    const fuse = new Fuse(combinedData, fuseOptions);
    const results = fuse.search(search);
    filteredData = results.map(result => result.item);
  }

  // Apply other filters
  if (filters.yearFrom) {
    filteredData = filteredData.filter(alum =>
      alum.year_graduated && alum.year_graduated >= filters.yearFrom
    );
  }

  if (filters.yearTo) {
    filteredData = filteredData.filter(alum =>
      alum.year_graduated && alum.year_graduated <= filters.yearTo
    );
  }

  if (filters.location) {
    filteredData = filteredData.filter(alum =>
      alum.location && alum.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.field) {
    filteredData = filteredData.filter(alum =>
      alum.field && alum.field.toLowerCase().includes(filters.field.toLowerCase())
    );
  }

  if (filters.skills) {
    filteredData = filteredData.filter(alum =>
      alum.skills && alum.skills.some(skill =>
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      )
    );
  }

  if (filters.sortCategory && filters.sortOrder) {
    const sortMapping = {
      year: (a, b) => (a.year_graduated || "").localeCompare(b.year_graduated || ""),
      name: (a, b) => a.last_name.localeCompare(b.last_name),
      location: (a, b) => (a.location || "").localeCompare(b.location || ""),
      field: (a, b) => (a.field || "").localeCompare(b.field || "")
    };

    const sortFn = sortMapping[filters.sortCategory] || sortMapping.name;
    filteredData.sort(sortFn);

    if (filters.sortOrder === "desc") {
      filteredData.reverse();
    }
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;
  const paginatedData = filteredData.slice(startIndex, endIndex + 1);

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
    .single();    // In case of duplicates, fetch latest created alumni profile
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