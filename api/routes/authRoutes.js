import express from "express";
import controller from "../controllers/authController.js";

const authRouter = () => {
  const router = express.Router();

  router.post("/sign-up", controller.signUp);

  router.post("/sign-in", [
    controller.signInGate,
    controller.signInSbLocal,
    controller.signedInUser
  ]);

  router.get("/sign-in/external", [
    controller.signInGate,
    controller.signInSbExternal
  ]);

  router.get("/sign-in/external/callback", [
    controller.signInGate,
    controller.signInSbExternalCallback,
    controller.signInRedirectFe
  ]);

  router.get("/sign-in/external/callback/raw", [
    controller.signInGate,
    controller.signInSbExternalCallback,
    controller.signedInUser
  ]);

  router.get("/confirm", [
    controller.signInGate,
    controller.signInSbConfirm,
    controller.signInRedirectFe
  ]);

  router.get("/confirm/raw", [
    controller.signInGate,
    controller.signInSbConfirm,
    controller.signedInUser
  ]);

  router.get("/confirm/change-email", [
    controller.signInSbConfirm,
    controller.signInRedirectFeSettingsEmail
  ]);

  router.get("/confirm/reset-password", [
    controller.signInSbConfirm,
    controller.signInRedirectFeSettingsPassword
  ]);

  router.post("/sign-up/email/resend", controller.signUpResendEmail);

  router.get("/signed-in-user", controller.signedInUser);

  router.post("/sign-out", controller.signOut);

  router.post("/update", controller.updateUser);

  return router;
};

export default authRouter;