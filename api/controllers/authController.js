import httpStatus from "http-status-codes";

async function signUp(aRequest, aResponse, aNext) {
  const {body} = aRequest;
  const requiredProps = [
    "username", "password"
  ];

  if (aResponse.sendErrorEmptyBody(requiredProps)) {
    return;
  }

  const {data, error} = await aRequest.supabase.auth.signUp({
    email: body.username,
    password: body.password,
    options: {
      emailRedirectTo: process.env.ICSA_FE_URL,
    },
  });

  if (error) {
    return aResponse.sendErrorUnauthenticated(error.message);
  }

  console.log(data);
  return aResponse.sendOk(data);
}

async function signInSbLocal(aRequest, aResponse, aNext) {
  const {body} = aRequest;
  const requiredProps = [
    "username", "password"
  ];

  if (aResponse.sendErrorEmptyBody(requiredProps)) {
    return;
  }

  const authTokenResponse = await aRequest.supabase.auth.signInWithPassword({
    email: body.username,
    password: body.password,
  });

  const {data, error} = authTokenResponse;

  if (error) {
    return aResponse.sendErrorUnauthenticated(error.message);
  }

  aRequest.rebuildUser(authTokenResponse);

  return aNext();
}

async function signInGate(aRequest, aResponse, aNext) {
  console.log("signInGate: Checking request body:", aRequest.body);
  if (aRequest.isAuthenticated()) {
    return aResponse.status(httpStatus.BAD_REQUEST).json({
      status: "FAILED",
      message: "A user is already signed in"
    });
  }
  return aNext();
}

async function signedInUser(aRequest, aResponse) {
  if (aRequest.user) {
    return aResponse.status(httpStatus.OK).json(aRequest.user);
  }
  return aResponse.status(httpStatus.NO_CONTENT).json({status: "NO_CONTENT"});
}

async function signOut(aRequest, aResponse) {
  if (aRequest.isUnauthenticated()) {
    return aResponse.status(httpStatus.NO_CONTENT).json({status: "NO_CONTENT"});
  }
  const {error} = await aRequest.supabase.auth.signOut();
  if (error) {
    return aResponse.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: "FAILED"});
  }
  return aResponse.status(httpStatus.OK).json({status: "OK"});
}

const authController = {
  signUp,
  signInSbLocal,
  signInGate,
  signedInUser,
  signOut,
};

export default authController;
