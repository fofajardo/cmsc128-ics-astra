import express from "express";
import alumniProfilesController from "../controllers/alumniProfilesController.js";

const alumniProfilesRouter = () => {
  const router = express.Router();

  router.get("/", alumniProfilesController.getAlumniProfiles);
  router.get("/alumni-search", alumniProfilesController.getAlumniSearch);
  router.get("/:userId", alumniProfilesController.getAlumniProfileById);
  router.post("/multiple-approve", alumniProfilesController.approveAlumniProfiles);
  router.post("/multiple-remove", alumniProfilesController.removeAlumniProfiles);
  router.post("/multiple-reactivate", alumniProfilesController.removeAlumniProfiles);
  router.post("/:userId", alumniProfilesController.createAlumniProfile);
  router.put("/:userId", alumniProfilesController.updateAlumniProfile);

  return router;
};

export default alumniProfilesRouter;