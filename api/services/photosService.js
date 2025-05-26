import { PhotoType } from "../../common/scopes.js";
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

const fetchAllFiles = async (supabase) => {
  return await supabase
    .from("files")
    .select("*");
};

const insertPhoto = async (supabase, photoData) => {
  return await supabase
    .from("photos")
    .insert(photoData)
    .select();
};

const insertFile = async (supabase, fileData) => {
  return await supabase
    .from("files")
    .insert(fileData)
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
    .rpc("photos_fetch_latest_image_key", {
      "user_id": alum_id,
      "type": PhotoType.PROOF_OF_GRADUATION
    });
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

const getAvatarUrl = async (supabase, id) => {
  let { data: keyData, error: keyError } = await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", id)
    .eq("type", PhotoType.PROFILE_PIC)
    .single();
  if (keyError) {
    // Try fetching from user metadata provided by auth.
    const { data: authData, error: authError } = await supabase
      .auth
      .admin
      .getUserById(id);
    const metaAvatarUrl = authData.user?.user_metadata?.avatar_url;
    if (!authError && metaAvatarUrl) {
      return { data: { signedUrl: metaAvatarUrl}, error: null };
    }
    return { data: keyData, error: keyError };
  }

  return await supabase
    .storage
    .from("user-photos-bucket")
    .createSignedUrl(keyData.image_key, 60 * 60);
};

const deleteAvatar = async (supabase, id) => {
  let { data: photosData, error: photosError } = await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", id)
    .eq("type", PhotoType.PROFILE_PIC);

  if (photosError) {
    return { error: photosError };
  }

  // If there are photos to delete
  if (photosData && photosData.length > 0) {
    const imageKeys = photosData.map(photo => photo.image_key);

    // Delete all files from storage
    const { error: storageError } = await supabase.storage
      .from("user-photos-bucket")
      .remove(imageKeys);

    if (storageError) {
      return { error: storageError };
    }
  }

  // Delete all profile pic records from the database
  return await supabase
    .from("photos")
    .delete()
    .eq("user_id", id)
    .eq("type", PhotoType.PROFILE_PIC);
};

const uploadOrReplaceAvatar = async (supabase, userId, fileContent, contentType) => {
  try {
    const { error: deleteError } = await deleteAvatar(supabase, userId);
    if (deleteError) {
      return { error: deleteError };
    }

    const filename = `avatar-${userId}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from("user-photos-bucket")
      .upload(filename, fileContent, {
        contentType,
        upsert: true,
      });

    if (storageError) {
      return { error: storageError };
    }

    // Save reference to database
    const photoData = {
      user_id: userId,
      content_id: null,
      type: PhotoType.PROFILE_PIC,
      image_key: storageData.path,
    };

    return await supabase
      .from("photos")
      .insert(photoData)
      .select();

  } catch (error) {
    return { error };
  }
};

const getDegreeProofUrl = async (supabase, id) => {
  let { data: keyData, error: keyError } = await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", id)
    .eq("type", PhotoType.PROOF_OF_GRADUATION)
    .single();
  if (keyError) {
    return { data: keyData, error: keyError };
  }
  return await supabase
    .storage
    .from("user-photos-bucket")
    .createSignedUrl(keyData.image_key, 60 * 60);
};

const deleteDegreeProof = async (supabase, id) => {
  let { data: photosData, error: photosError } = await supabase
    .from("photos")
    .select("image_key")
    .eq("user_id", id)
    .eq("type", PhotoType.PROOF_OF_GRADUATION);

  if (photosError) {
    return { error: photosError };
  }

  // If there are photos to delete
  if (photosData && photosData.length > 0) {
    const imageKeys = photosData.map(photo => photo.image_key);

    // Delete all files from storage
    const { error: storageError } = await supabase.storage
      .from("user-photos-bucket")
      .remove(imageKeys);

    if (storageError) {
      return { error: storageError };
    }
  }

  // Delete all profile pic records from the database
  return await supabase
    .from("photos")
    .delete()
    .eq("user_id", id)
    .eq("type", PhotoType.PROOF_OF_GRADUATION);
};

const uploadOrReplaceDegreeProof = async (supabase, userId, fileContent, contentType) => {
  try {
    const { error: deleteError } = await deleteDegreeProof(supabase, userId);
    if (deleteError) {
      return { error: deleteError };
    }

    const filename = `dgp-${userId}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from("user-photos-bucket")
      .upload(filename, fileContent, {
        contentType,
        upsert: true,
      });

    if (storageError) {
      return { error: storageError };
    }

    // Save reference to database
    const photoData = {
      user_id: userId,
      content_id: null,
      type: PhotoType.PROOF_OF_GRADUATION,
      image_key: storageData.path,
    };

    return await supabase
      .from("photos")
      .insert(photoData)
      .select();

  } catch (error) {
    return { error };
  }
};

const fetchDonationReceipt = async (supabase, userId, projectId) => {
  return await supabase
    .from("photos")
    .select("*")
    .eq("user_id", userId)
    .eq("content_id", projectId)
    .eq("type", PhotoType.PROOF_OF_PAYMENT);
};

const fetchFileById = async (supabase, id) => {
  return await supabase
    .from("files")
    .select("*")
    .eq("content_id", id)
    .single();
};

const deleteNewsletterById = async (supabase, id) => {
  return await supabase
    .from("files")
    .delete()
    .eq("content_id", id);
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
  getAvatarUrl,
  deleteAvatar,
  uploadOrReplaceAvatar,
  fetchDonationReceipt,
  insertFile,
  fetchAllFiles,
  fetchFileById,
  deleteNewsletterById,
  uploadOrReplaceDegreeProof,
  getDegreeProofUrl,
  deleteDegreeProof,
};

export default photosService;