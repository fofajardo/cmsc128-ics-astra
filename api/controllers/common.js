import PhotosService from "../services/photosService.js";

export async function retrieveAvatarForUser(req, userId, data) {
  // FIXME: commit this image to the repository, don't reference externally!
  let avatarUrl = "https://cdn-icons-png.flaticon.com/512/145/145974.png";
  const {data: avatarData, error: avatarError} =
    await PhotosService.getAvatarUrl(req.supabase, userId);
  if (avatarError) {
    data.avatar_exists = false;
  } else {
    avatarUrl = avatarData?.signedUrl;
  }
  data.avatar_url = avatarUrl;
}