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

    router.get("/signed-in-user", controller.signedInUser);

    router.post("/sign-out", controller.signOut);

    return router;
};

export default authRouter;