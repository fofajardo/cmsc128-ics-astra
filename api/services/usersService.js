import { applyFilter, applyArrayFilter, applyArraySearch, applyPagination } from "../utils/filters.js";
import { RoleName } from "../../common/scopes.js";

const fuseThreshold = 0.3;
const fuseOptions = {
  keys: [
    "first_name",
    "middle_name",
    "last_name",
    "full_name"
  ],
  threshold: fuseThreshold, // Adjust this value (0-1) for more/less strict matching
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2 // Minimum characters required for matching
};

const fetchUsers = async (supabase, page = 1, limit = 10, isRecent = false, isAlumni = false) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;

  let query = supabase
    .from("users")
    .select("*, alumni_profiles(*)") // we always need alumni_profiles if we"re filtering by it
    .order("created_at", { ascending: false });

  // Apply role filter for alumni
  if (isAlumni) {
    query = query.eq("role", "alumnus");
  }

  if (isRecent) {
    const boundDate = new Date();
    boundDate.setDate(boundDate.getDate() - 365);
    query = query.gte("created_at", boundDate.toISOString());
  }

  const { data, error } = await query;

  if (error) return { error };

  let filteredData = data;

  // Process alumni_profiles if necessary
  if ((isAlumni) && Array.isArray(filteredData)) {
    filteredData = filteredData.map((user) => {
      if (user.alumni_profiles && user.alumni_profiles.length > 0) {
        const sortedProfiles = [...user.alumni_profiles].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        user.alumni_profiles = sortedProfiles[0]; // Keep only the latest one
      } else {
        user.alumni_profiles = null;
      }
      return user;
    });
  }

  // Apply pagination last, since we might have filtered in JS
  const paginatedData = filteredData.slice(startIndex, endIndex + 1);

  return { data: paginatedData };
};

const fetchInactiveAlumni = async (supabase, page = 1, limit = 10, search = "", filters = {}) => {
  const { data: alumniProfiles, error: profilesError } = await supabase
    .from("inactive_alumni_view")
    .select(`
      email,
      alum_id,
      first_name,
      middle_name,
      last_name,
      location,
      skills,
      created_at,
      primary_work_experience:work_experiences (
        field
      ),
      student_num,
      course,
      profile_created_at
    `);

  if (profilesError) throw profilesError;

  const { data: degreePrograms, error: degreesError } = await supabase
    .from("degree_programs")
    .select("user_id, year_graduated")
    .in("user_id", alumniProfiles.map(alum => alum.alum_id));

  if (degreesError) throw degreesError;

  const combinedData = alumniProfiles.map(alum => {
    const degrees = degreePrograms.filter(d => d.user_id === alum.alum_id);

    return {
      ...alum,
      year_graduated: degrees[0]?.year_graduated || null,
      field: alum.primary_work_experience?.field || null,
      full_name: `${alum.first_name} ${alum.middle_name ? alum.middle_name + " " : ""}${alum.last_name}`.trim()
    };
  });

  let filteredData = combinedData;
  filteredData = applyArraySearch(filteredData, search, fuseOptions);
  filteredData = applyArrayFilter(filteredData, filters);
  const paginatedData = applyPagination(filteredData, page, limit);

  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    totalPages: Math.ceil(filteredData.length / limit)
  };
};

const fetchApprovedAlumni = async (supabase, page = 1, limit = 10, search = "", filters = {}) => {
  const { data: alumniProfiles, error: profilesError } = await supabase
    .from("approved_alumni_view")
    .select(`
      alum_id,
      first_name,
      middle_name,
      last_name,
      location,
      skills,
      created_at,
      primary_work_experience:work_experiences (
        field
      ),
      student_num,
      course
    `);

  if (profilesError) throw profilesError;

  const { data: degreePrograms, error: degreesError } = await supabase
    .from("degree_programs")
    .select("user_id, year_graduated")
    .in("user_id", alumniProfiles.map(alum => alum.alum_id));

  if (degreesError) throw degreesError;

  const combinedData = alumniProfiles.map(alum => {
    const degrees = degreePrograms.filter(d => d.user_id === alum.alum_id);

    return {
      ...alum,
      year_graduated: degrees[0]?.year_graduated || null,
      field: alum.primary_work_experience?.field || null,
      full_name: `${alum.first_name} ${alum.middle_name ? alum.middle_name + " " : ""}${alum.last_name}`.trim()
    };
  });

  let filteredData = combinedData;
  filteredData = applyArraySearch(filteredData, search, fuseOptions);
  filteredData = applyArrayFilter(filteredData, filters);
  const paginatedData = applyPagination(filteredData, page, limit);

  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    totalPages: Math.ceil(filteredData.length / limit)
  };
};

const fetchPendingAlumni = async (supabase, page = 1, limit = 10, search = "", filters = {}) => {
  const { data: alumniProfiles, error: profilesError } = await supabase
    .from("pending_alumni_view")
    .select(`
      alum_id,
      first_name,
      middle_name,
      last_name,
      location,
      skills,
      created_at,
      primary_work_experience:work_experiences (
        field
      ),
      student_num,
      course
    `);

  if (profilesError) throw profilesError;

  const { data: degreePrograms, error: degreesError } = await supabase
    .from("degree_programs")
    .select("user_id, year_graduated")
    .in("user_id", alumniProfiles.map(alum => alum.alum_id));

  if (degreesError) throw degreesError;

  const combinedData = alumniProfiles.map(alum => {
    const degrees = degreePrograms.filter(d => d.user_id === alum.alum_id);

    return {
      ...alum,
      year_graduated: degrees[0]?.year_graduated || null,
      field: alum.primary_work_experience?.field || null,
      full_name: `${alum.first_name} ${alum.middle_name ? alum.middle_name + " " : ""}${alum.last_name}`.trim()
    };
  });

  let filteredData = combinedData;
  filteredData = applyArraySearch(filteredData, search, fuseOptions);
  filteredData = applyArrayFilter(filteredData, filters);
  const paginatedData = applyPagination(filteredData, page, limit);

  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    totalPages: Math.ceil(filteredData.length / limit)
  };
};

const fetchUserById = async (supabase, userId) => {
  return await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
};

const fetchUsersByFilter = async (supabase, filters) => {
  let query = supabase
    .from("users")
    .select("*");

  query = applyFilter(query, filters, {
    ilike: [],
    range: {},
    sortBy: "updated_at",
    defaultOrder: "desc",
    specialKeys: []
  });

  return await query;
};

const checkExistingUser = async (supabase, username, email) => {
  return await supabase
    .from("users")
    .select("id")
    .or(`username.eq.${username},email.eq.${email}`)
    .not("role", "eq", RoleName.UNLINKED);
};

const insertUser = async (supabase, userData) => {
  return await supabase
    .from("users")
    .insert(userData)
    .select("id");
};

const updateUserData = async (supabase, userId, updateData) => {
  return await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);
};

const softDeleteUser = async (supabase, userId) => {
  return await supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", userId);
};

const hardDeleteUser = async (supabase, userId) => {
  return await supabase
    .from("users")
    .delete()
    .eq("id", userId);
};

const usersService = {
  fetchUsers,
  fetchInactiveAlumni,
  fetchApprovedAlumni,
  fetchPendingAlumni,
  fetchUserById,
  fetchUsersByFilter,
  checkExistingUser,
  insertUser,
  updateUserData,
  softDeleteUser,
  hardDeleteUser
};

export default usersService;