import express from "express";
import organizationsController from "../controllers/organizationsController.js";

const organizationsRouter = () => {
  const router = express.Router();

  router.get("/", organizationsController.getOrganizations);
  router.get("/:orgId", organizationsController.getOrganizationById);
  router.get("/:orgId/alumni", organizationsController.getAlumni);
  router.post("/", organizationsController.createOrganization);
  router.put("/:orgId", organizationsController.updateOrganization);
  router.delete("/:orgId", organizationsController.deleteOrganization);

  return router;
};

export default organizationsRouter;