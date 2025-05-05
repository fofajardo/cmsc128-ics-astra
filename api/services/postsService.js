//import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js";
import { applyFilter } from "../utils/applyFilter.js";

async function fetchPosts (aSupabaseAuthClient, aFilters) {
  let query = aSupabaseAuthClient
    .from("posts")
    .select(`
      *,
      content_data: contents (
        title,
        details,
        tags,
        views
      )
    `);

  return await query;
};

async function fetchPostById (aSupabaseAuthClient, aPostId) {
  return await aSupabaseAuthClient
    .from("posts")
    .select(`
      *,
      content_data: contents (
        title,
        details,
        tags,
        views
      )
    `)
    .eq("post_id", aPostId)
    .single();
};

async function checkExistingPost (aSupabaseAuthClient, aTitle, aDetails) {
  return await aSupabaseAuthClient
    .select("post_id")
    .from("posts")
    .join("contents", "posts.post_id", "contents.id")
    .match({
      title: aTitle,
      details: aDetails
    });
};

async function insertPost (aSupabaseAuthClient, aPostData) {
  return await aSupabaseAuthClient
    .from("posts")
    .insert(aPostData)
    .select("*")
    .single();
};

async function updatePostData (aSupabaseAuthClient, aPostId, aUpdateData) {
  return await aSupabaseAuthClient
    .from("posts")
    .update(aUpdateData)
    .eq("post_id", aPostId);
};

async function deletePostData (aSupabaseAuthClient, aPostId) {
  return await aSupabaseAuthClient
    .from("posts")
    .delete()
    .eq("post_id", aPostId);
};

const postsService = {
  fetchPosts,
  fetchPostById,
  checkExistingPost,
  insertPost,
  updatePostData,
  deletePostData
};

export default postsService;