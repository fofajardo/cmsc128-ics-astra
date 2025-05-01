import UsersService from "../services/usersService.js";
import IdentityService from "../services/identityService.js";

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
    }
  };

  await aRequest.fetchAuthState();

  return aNext();
}
