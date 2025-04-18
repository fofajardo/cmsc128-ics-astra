const fetchDonations = async (supabase, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit) - 1;

    return await supabase
        .from("donations")
        .select()
        .range(startIndex, endIndex);
};

const fetchDonationById = async (supabase, donationId) => {
    return await supabase
        .from("donations")
        .select("*")
        .eq("id", donationId)
        .single();
};

const insertDonation = async (supabase, donationData) => {
    return await supabase
        .from("donations")
        .insert(donationData)
        .select('id')
        .single();;
};

const updateDonationData = async (supabase, donationId, updateData) => {
    return await supabase
        .from("donations")
        .update(updateData)
        .eq("id", donationId);
};

const deleteDonation = async (supabase, donationId) => {
    return await supabase
        .from("donations")
        .delete()
        .eq("id", donationId);
}

const donationsService = {
    fetchDonations,
    fetchDonationById,
    insertDonation,
    updateDonationData,
    deleteDonation
};

export default donationsService;