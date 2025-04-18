import httpStatus from "http-status-codes";
import passport from "passport";

const signInPassportLocal = passport.authenticate("local");

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
    return aResponse.status(httpStatus.NO_CONTENT).json({ status: "NO_CONTENT" });
}

async function signOut(aRequest, aResponse) {
    if (aRequest.isUnauthenticated()) {
        return aResponse.status(httpStatus.NO_CONTENT).json({ status: "NO_CONTENT" });
    }
    return aRequest.logout(function (aError) {
        if (aError) {
            return aResponse.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: "FAILED" });
        }
        return aResponse.status(httpStatus.OK).json({ status: "OK" });
    });
}

const authController = {
    signInPassportLocal,
    signInGate,
    signedInUser,
    signOut,
};

export default authController;
