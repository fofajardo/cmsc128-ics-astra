import express from "express";
import projectsController from "../controllers/projectsController.js";

const projectsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", projectsController.getProjects(supabase));
    router.get("/:projectId", projectsController.getProjectById(supabase));
    router.post("/", projectsController.createProject(supabase));
    router.put("/:projectId", projectsController.updateProject(supabase));
    router.delete("/:projectId", projectsController.deleteProject(supabase));

    return router;
};

export default projectsRouter;