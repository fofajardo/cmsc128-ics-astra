import httpStatus from "http-status-codes";

function RequireAuthenticated(aRequest, aResponse, aNext) {
  if (process.env.ICSA_API_SPECIAL_POWERS === "TRUE") {
    return aNext();
  } else if (aRequest.isAuthenticated()) {
    return aNext();
  }
  return aResponse.status(httpStatus.FORBIDDEN).json({
    status: "FORBIDDEN",
    message: "You are not allowed to access this resource. Require auth"
  });
}

export { RequireAuthenticated };