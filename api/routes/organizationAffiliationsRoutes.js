import express from "express";
import organizationAffiliationsController from "../controllers/organizationAffiliationsController.js";

const organizationAffiliationsRouter = (supabase) => {
    const router = express.Router();

    router.get("/:alumId/organizations", organizationAffiliationsController.getAffiliatedOrganizations(supabase));
    router.post("/:alumId/organizations", organizationAffiliationsController.affiliateAlumnusToOrganization(supabase));
    router.put("/:alumId/organizations/:orgId", organizationAffiliationsController.updateAffiliationData(supabase));
    router.delete("/:alumId/organizations/:orgId", organizationAffiliationsController.deleteAffiliatedOrganization(supabase));

    return router;
};

export default organizationAffiliationsRouter;