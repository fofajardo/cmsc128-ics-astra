import express from "express";
import workExperiencesController from "../controllers/workExperiencesController.js";

const workExperiencesRouter = () => {
  const router = express.Router();

  router.get("/", workExperiencesController.getWorkExperiences);
  router.get("/distinct-fields", workExperiencesController.getDistinctFields);
  router.get("/:workExperienceId", workExperiencesController.getWorkExperienceById);
  router.get("/alum/:userId", workExperiencesController.getWorkExperiencesByUserId);
  router.post("/", workExperiencesController.createWorkExperience);
  router.put("/:workExperienceId", workExperiencesController.updateWorkExperience);
  router.delete("/:workExperienceId", workExperiencesController.deleteWorkExperience);

  return router;
};

export default workExperiencesRouter;