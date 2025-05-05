const fetchOrganizations = async (supabase, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;

  return await supabase
    .from("organizations")
    .select()
    .range(startIndex, endIndex);
};

const fetchOrganizationById = async (supabase, orgId) => {
  return await supabase
    .from("organizations")
    .select()
    .eq("id", orgId)
    .single();
};

const fetchAlumni = async (supabase, orgId, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;

  return await supabase
    .from("organization_affiliations")
    .select(`
            role,
            joined_date,
            alumni_profiles(
                *
            ),
            users (
                first_name,
                last_name,
                email
            )

        `)
    .eq("org_id", orgId)
    .range(startIndex, endIndex);
};

const checkOrganizationIfExistingByNameAndAcronym = async (supabase, name, acronym) => {
  return await supabase
    .from("organizations")
    .select()
    .match({ name: name, acronym: acronym });
};

const checkOrganizationIfExistingById = async (supabase, orgId) => {
  return await supabase
    .from("organizations")
    .select()
    .eq("id", orgId);
};

const insertOrganization = async (supabase, organizationData) => {
  return await supabase
    .from("organizations")
    .insert(organizationData)
    .select("id");
};

const updateOrganization = async (supabase, orgId, updateData) => {
  return await supabase
    .from("organizations")
    .update(updateData)
    .eq("id", orgId);
};

const deleteOrganization = async (supabase, orgId) => {
  return await supabase
    .from("organizations")
    .delete()
    .eq("id", orgId);
};

const fetchOrganizationStatistics = async (supabase) => {
  return await supabase
    .from("organization_view")
    .select("*")
    .single();
};

const organizationsService = {
  fetchOrganizations,
  fetchOrganizationById,
  checkOrganizationIfExistingByNameAndAcronym,
  checkOrganizationIfExistingById,
  insertOrganization,
  updateOrganization,
  deleteOrganization,
  fetchAlumni,
  fetchOrganizationStatistics
};

export default organizationsService;