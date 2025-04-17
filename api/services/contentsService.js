const fetchContents = async (supabase, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit) - 1;

    return await supabase
        .from("contents")
        .select("*")
        .range(startIndex, endIndex);
};

const fetchContentById = async (supabase, contentId) => {
    return await supabase
        .from("contents")
        .select("*")
        .eq("id", contentId)
        .single();
};

const checkExistingContent = async (supabase, title) => {
    return await supabase
        .from("contents")
        .select("id")
        .or(`title.eq.${title}`);
};

const insertContent = async (supabase, contentData) => {
    return await supabase
        .from("contents")
        .insert(contentData)
        .select("id")
        .single();
};

const findContent = async (supabase, contentId) => {
    return await supabase
        .from("contents")
        .select("*")
        .eq("id", contentId)
        .single();
};

const updateContentData = async (supabase, contentId, updateData) => {
    return await supabase
        .from("contents")
        .update(updateData)
        .eq("id", contentId);
};

const deleteContentData = async (supabase, contentId) => {
    return await supabase
        .from("contents")
        .delete()
        .eq("id", contentId);
};

const contentsService = {
    fetchContents,
    fetchContentById,
    checkExistingContent,
    insertContent,
    findContent,
    updateContentData,
    deleteContentData
};

export default contentsService;