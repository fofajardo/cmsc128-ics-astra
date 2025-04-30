import express from "express";
import alumniProfilesController from "../controllers/alumniProfilesController.js";

const alumniProfilesRouter = () => {
  const router = express.Router();

  router.get("/", alumniProfilesController.getAlumniProfiles);
  router.get("/:userId", alumniProfilesController.getAlumniProfileById);
  router.post("/:userId", alumniProfilesController.createAlumniProfile);
  router.put("/:userId", alumniProfilesController.updateAlumniProfile);

  return router;
};

export default alumniProfilesRouter;