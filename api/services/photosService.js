// FIXME: THESE PHOTO TYPES SHOULD BE IN AN ENUM!
import { PhotoType } from "../../common/photo_types.js"; // Assuming you have an enum for photo types

const fetchAllPhotos = async (supabase) => {
  return await supabase
    .from("photos")
    .select("*");
};

const fetchPhotoById = async (supabase, id) => {
  return await supabase
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();
};

const insertPhoto = async (supabase, photoData) => {
  return await supabase
    .from("photos")
    .insert(photoData)
    .select();
};

const updatePhotoById = async (supabase, id, updateData) => {
  return await supabase
    .from("photos")
    .update(updateData)
    .eq("id", id)
    .select();
};

const deletePhotoById = async (supabase, id) => {
  return await supabase
    .from("photos")
    .delete()
    .eq("id", id);
};

const fetchAllProfilePics = async (supabase) => {
  return await supabase
    .from("photos")
    .select("*")
    .eq("type", PhotoType.PROFILE_PIC); // 0 for profile pictures
};

const fetchEventPhotos = async (supabase, content_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("content_id", content_id)
    .eq("type", PhotoType.EVENT_PIC) // Type 3 is for event_pic
    .single();
};

const fetchPhotoIdbyAlum = async (supabase, alum_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", alum_id)
    .eq("type", PhotoType.PROFILE_PIC) // Assuming type 0 is for profile pictures
    .single();
};

const fetchDegreeProofPhoto = async (supabase, alum_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", alum_id)
    .eq("type", PhotoType.PROOF_OF_GRADUATION) // Assuming type 100 is for degree proof
    .single();
};

const fetchProjectPhotos = async (supabase, project_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("content_id", project_id)
    .eq("type", PhotoType.PROJECT_PIC) // Type 5 is for project_pic
    .single();
};

const fetchJobPhotos = async (supabase, job_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("content_id", job_id)
    .eq("type", PhotoType.JOB_PIC) // Use enum instead of hardcoded 4
    .single();
};

const fetchPhotoTypesByContentIds = async (supabase, contentIds) => {
  return await supabase
    .from("photos")
    .select("content_id, type")
    .in("content_id", contentIds)
    .not("content_id", "is", null);
};

const fetchPhotosByContentId = async (supabase, contentId) => {
  return await supabase
    .from("photos")
    .select("*")
    .eq("content_id", contentId);
};

const photosService = {
  fetchAllPhotos,
  fetchPhotoById,
  fetchDegreeProofPhoto,
  insertPhoto,
  updatePhotoById,
  deletePhotoById,
  fetchAllProfilePics,
  fetchEventPhotos,
  fetchPhotoIdbyAlum,
  fetchProjectPhotos,
  fetchJobPhotos,
  fetchPhotoTypesByContentIds,
  fetchPhotosByContentId,
};

export default photosService;