const fetchAffiliations = async (supabase, page, limit, alumId) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;

  return await supabase
    .from("organization_affiliations")
    .select(`
            role,
            joined_date,
            organizations (
                name
            )
        `)
    .eq("user_id", alumId)
    .range(startIndex, endIndex);
};

const checkAffiliationIfExisting = async (supabase, orgId, alumId) => {
  return await supabase
    .from("organization_affiliations")
    .select()
    .match({ org_id: orgId, user_id: alumId });
};

const createAffiliation = async (supabase, affiliationData) => {
  return await supabase
    .from("organization_affiliations")
    .insert(affiliationData);
};

const updateAffiliation = async (supabase, orgId, alumId, updateData) => {
  return await supabase
    .from("organization_affiliations")
    .update(updateData)
    .match({ org_id: orgId, user_id: alumId });
};

const deleteAffiliation = async (supabase, orgId, alumId) => {
  return await supabase
    .from("organization_affiliations")
    .delete()
    .match({ org_id: orgId, user_id: alumId });
};


const organizationAffiliationsService = {
  fetchAffiliations,
  checkAffiliationIfExisting,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
};

export default organizationAffiliationsService;