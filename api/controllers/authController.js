import httpStatus from "http-status-codes";
import {clientRoutes} from "../../common/routes.js";

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

  aRequest.fetchAuthState(authTokenResponse);

  return aNext();
}

async function signInSbExternal(aRequest, aResponse, aNext) {
  const { provider } = aRequest.query;
  if (provider === null || provider === undefined) {
    return aResponse.sendErrorClient("Provider is missing");
  }

  const allowedProviders = ["google"];
  if (!allowedProviders.includes(provider)) {
    return aResponse.sendErrorClient("Unknown provider");
  }

  const { data, error } = await aRequest.supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: clientRoutes.auth.signInExternalCallback(),
    },
  });

  if (data.url) {
    aResponse.redirect(data.url);
  }
}

async function signInSbExternalCallback(aRequest, aResponse, aNext) {
  const { code } = aRequest.query;

  if (!code) {
    return aResponse.sendErrorClient("No code provided");
  }

  const authTokenResponse = await aRequest.supabase.auth.exchangeCodeForSession(code);

  const {data, error} = authTokenResponse;

  if (error) {
    return aResponse.sendErrorUnauthenticated(error.message);
  }

  aRequest.fetchAuthState(authTokenResponse);

  return aNext();
}

async function signInGate(aRequest, aResponse, aNext) {
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
  signInSbExternal,
  signInSbExternalCallback,
  signInGate,
  signedInUser,
  signOut,
};

export default authController;
