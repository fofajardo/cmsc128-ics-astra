const fetchReports = async (supabase, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit) - 1;

    return await supabase
        .from("reports")
        .select("*")
        .range(startIndex, endIndex);
};

const fetchReportById = async (supabase, reportId) => {
    return await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();
};

const insertReport = async (supabase, reportData) => {
    return await supabase
        .from("reports")
        .insert(reportData)
        .select("id");
};

const updateReportStatus = async (supabase, reportId, status) => {
    return await supabase
        .from("reports")
        .update({ status })
        .eq("id", reportId);
};

const deleteReport = async (supabase, reportId) => {
    return await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);
};

const reportsService = {
    fetchReports,
    fetchReportById,
    insertReport,
    updateReportStatus,
    deleteReport
};

export default reportsService;
