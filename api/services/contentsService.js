import { applyFilter } from "../utils/applyFilter.js";

const fetchContents = async (supabase, filters) => {
  let query = supabase
    .from("contents")
    .select("*");

  // Apply additional filters
  query = applyFilter(query, filters, {
    ilike: ["title", "details"],
    range: {
      created_at: [filters.created_at_from, filters.created_at_to]
    },
    sortBy: filters.sortBy || "created_at",
    defaultOrder: filters.order || "desc",
    specialKeys: ["created_at_from", "created_at_to", "sortBy", "order"]
  });

  // Add filter for tags if it's present
  if (filters.tags) {
    // Ensure tags are passed as a proper array format for PostgreSQL
    query = query.contains("tags", Array.isArray(filters.tags) ? filters.tags : [filters.tags]);
  }

  return await query;
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
    .select("*")
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