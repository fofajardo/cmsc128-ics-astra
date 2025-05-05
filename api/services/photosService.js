// FIXME: THESE PHOTO TYPES SHOULD BE IN AN ENUM!

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
    .eq("type", 0); // 0 for profile pictures
};

const fetchEventPhotos = async (supabase, content_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("content_id", content_id)
    .eq("type", 3) // Type 3 is for event_pic
    .single();
};

const fetchPhotoIdbyAlum = async (supabase, alum_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", alum_id)
    .eq("type", 0) // Assuming type 0 is for profile pictures
    .single();
};

const fetchDegreeProofPhoto = async (supabase, alum_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", alum_id)
    .eq("type", 100) // Assuming type 100 is for degree proof
    .single();
};

const fetchProjectPhotos = async (supabase, project_id) => {
  return await supabase
    .from("photos")
    .select("image_key")
    .eq("content_id", project_id)
    .eq("type", 5) // Type 5 is for project_pic
    .single();
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
};

export default photosService;