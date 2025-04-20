function RequireAuthenticated(aRequest, aResponse, aNext) {
    if (aRequest.isAuthenticated()) {
        return aNext();
    }
    return aResponse.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
    });
}

export { RequireAuthenticated };