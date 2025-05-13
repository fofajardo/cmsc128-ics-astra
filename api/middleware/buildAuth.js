import UsersService from "../services/usersService.js";
import IdentityService from "../services/identityService.js";
import PhotosService from "../services/photosService.js";

export async function BuildAuth(aRequest, aResponse, aNext) {
  aRequest.fetchAuthState = async function fetchAuthState(aUserResponse) {
    const {data: userData, error: userError} =
      aUserResponse ?? await aRequest.supabase.auth.getUser();

    aRequest.isAuthenticated = function () {
      return !userError && userData !== null && userData.user;
    };

    aRequest.isUnauthenticated = function () {
      return userError || !aRequest.isAuthenticated();
    };

    if (userData?.user) {
      aRequest.user = userData?.user;
      const {data: publicUserData, error: publicUserError} =
        await UsersService.fetchUserById(aRequest.supabase, userData?.user.id);
      if (!publicUserError) {
        publicUserData.scopes = await IdentityService.defineScopes(publicUserData);
        aRequest.user.public_metadata = publicUserData;
      }
      let avatarUrl = userData?.user?.user_metadata?.avatar_url;
      const {data: avatarData, error: avatarError} =
        await PhotosService.getAvatarUrl(aRequest.supabase, userData?.user.id);
      if (!avatarError) {
        avatarUrl = avatarData?.data?.signedUrl;
      }
      if (!avatarUrl) {
        // FIXME: commit this image to the repository, don't reference externally!
        avatarUrl = "https://cdn-icons-png.flaticon.com/512/145/145974.png";
      }
      aRequest.user.avatar_url = avatarUrl;
    }
  };

  await aRequest.fetchAuthState();

  return aNext();
}
