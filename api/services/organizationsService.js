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
}

const checkOrganizationIfExistingByNameAndAcronym = async (supabase, name, acronym) => {
    return await supabase
        .from("organizations")
        .select()
        .match({ name: name, acronym: acronym });
}  

const checkOrganizationIfExistingById = async (supabase, orgId) => {
    return await supabase
        .from("organizations")
        .select()
        .eq("id", orgId);
}


const insertOrganization = async (supabase, organizationData) => {
    return await supabase
        .from("organizations")
        .insert(organizationData)
        .select("id");
}

const updateOrganization = async (supabase, orgId, updateData) => {
    return await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", orgId);
}

const deleteOrganization = async (supabase, orgId) => {
    return await supabase
        .from("organizations")
        .delete()
        .eq("id", orgId);
}

const organizationsService = {
    fetchOrganizations,
    fetchOrganizationById,
    checkOrganizationIfExistingByNameAndAcronym,
    checkOrganizationIfExistingById,
    insertOrganization,
    updateOrganization,
    deleteOrganization
};

export default organizationsService;