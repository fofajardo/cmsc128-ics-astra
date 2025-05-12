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
  fetchAlumniSearch,
  fetchAlumniProfileById,
  fetchAlumniProfilesByFilter,
  insertAlumniProfile,
  updateAlumniProfileData,
  deleteAlumniProfileData
};

export default alumniService;