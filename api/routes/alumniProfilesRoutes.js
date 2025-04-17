import express from "express";
import alumniProfilesController from "../controllers/alumniProfilesController.js";

const alumniProfilesRouter = (supabase) => {
    const router = express.Router();

    router.get("/", alumniProfilesController.getAlumniProfiles(supabase));
    router.get("/:userId", alumniProfilesController.getAlumniProfileById(supabase));
    router.post("/", alumniProfilesController.createAlumniProfile(supabase));
    router.put("/:userId", alumniProfilesController.updateAlumniProfile(supabase));

    return router;
};

export default alumniProfilesRouter;