import express from "express";
import organizationAffiliationsController from "../controllers/organizationAffiliationsController.js";

const organizationAffiliationsRouter = () => {
  const router = express.Router();

  router.get("/:alumId/organizations", organizationAffiliationsController.getAffiliatedOrganizations);
  router.post("/:alumId/organizations", organizationAffiliationsController.affiliateAlumnusToOrganization);
  router.put("/:alumId/organizations/:orgId", organizationAffiliationsController.updateAffiliationData);
  router.delete("/:alumId/organizations/:orgId", organizationAffiliationsController.deleteAffiliatedOrganization);

  return router;
};

export default organizationAffiliationsRouter;