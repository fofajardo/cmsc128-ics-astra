import express from "express";
import workExperiencesController from "../controllers/workExperiencesController.js";

const workExperiencesRouter = (supabase) => {
    const router = express.Router();

    router.get("/", workExperiencesController.getWorkExperiences(supabase));
    router.get("/:workExperienceId", workExperiencesController.getWorkExperienceById(supabase));
    router.get("/alum/:alumId", workExperiencesController.getWorkExperiencesByAlumId(supabase));
    router.post("/", workExperiencesController.createWorkExperience(supabase));
    router.put("/:workExperienceId", workExperiencesController.updateWorkExperience(supabase));
    router.delete("/:workExperienceId", workExperiencesController.deleteWorkExperience(supabase));

    return router;
}

export default workExperiencesRouter;