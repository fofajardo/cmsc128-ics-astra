import { applyFilter } from "../utils/applyFilter.js";

const fetchContents = async (supabase, filters = {}) => {
  let query = supabase
    .from("contents")
    .select("*");

  // Apply filters if any
  query = applyFilter(query, filters, {
    ilike: ["title", "details"],
    range: {},
    sortBy: "created_at",
    defaultOrder: "desc",
    specialKeys: []
  });

  return await query;
};

const fetchContentById = async (supabase, contentId) => {
  return await supabase
    .from("contents")
    .select("*")
    .eq("id", contentId)
    .single();
};

const checkExistingContent = async (supabase,title) => {
  return await supabase
    .from("contents")
    .select("id")
    .eq("title", title);
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