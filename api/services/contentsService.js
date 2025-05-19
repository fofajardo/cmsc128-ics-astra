import { applyFilter } from "../utils/filters.js";

const fetchContents = async (supabase, filters = {}) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit - 1;

  let query = supabase
    .from("contents")
    .select("*", { count: "exact" });

  // Filter for announcements if specified
  if (filters.tag === "announcement") {
    query = query.contains("tags", ["announcement"]);
  }

  // Apply filters if any
  query = applyFilter(query, filters, {
    ilike: ["title", "details"],
    range: {
      created_at: [filters.created_at_from, filters.created_at_to]
    },
    sortBy: filters.sort_by || "created_at",
    defaultOrder: filters.order || "desc",
    specialKeys: [
      "page",
      "limit",
      "created_at_from",
      "created_at_to",
      "sort_by",
      "order",
      "tag"
    ]
  });

  // Add pagination
  query = query.range(startIndex, endIndex);

  return await query;
};

const fetchContentById = async (supabase, contentId) => {
  return await supabase
    .from("contents")
    .select("*")
    .eq("id", contentId)
    .single();
};

const fetchContentByFilter = async (supabase, filters) => {
  let query = supabase
    .from("contents")
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
  fetchContentByFilter,
  checkExistingContent,
  insertContent,
  findContent,
  updateContentData,
  deleteContentData
};

export default contentsService;