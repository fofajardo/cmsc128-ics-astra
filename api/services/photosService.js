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

const photosService = {
  fetchAllPhotos,
  fetchPhotoById,
  insertPhoto,
  updatePhotoById,
  deletePhotoById,
  fetchAllProfilePics
};

export default photosService;