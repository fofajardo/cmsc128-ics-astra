export async function BuildAuth(aRequest, aResponse, aNext) {
  aRequest.rebuildUser = function (aUserResponse) {
    const {data, error} = aUserResponse;

    aRequest.isAuthenticated = function () {
      return !error && data !== null && data.user;
    };

    aRequest.isUnauthenticated = function () {
      return error || !aRequest.isAuthenticated();
    };

    aRequest.user = data?.user;
  };

  aRequest.fetchAuthState = async function fetchAuthState() {
    const userResponse = await aRequest.supabase.auth.getUser();

    aRequest.rebuildUser(userResponse);
  };

  await aRequest.fetchAuthState();

  return aNext();
}
