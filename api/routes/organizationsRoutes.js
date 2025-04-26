import express from "express";
import organizationsController from "../controllers/organizationsController.js";

const organizationsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", organizationsController.getOrganizations(supabase));
    router.get("/:orgId", organizationsController.getOrganizationById(supabase));
    router.get("/:orgId/alumni", organizationsController.getAlumni(supabase));
    router.post("/", organizationsController.createOrganization(supabase));
    router.put("/:orgId", organizationsController.updateOrganization(supabase));
    router.delete("/:orgId", organizationsController.deleteOrganization(supabase));

    return router;
};

export default organizationsRouter;