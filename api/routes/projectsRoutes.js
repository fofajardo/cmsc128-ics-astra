import express from "express";
import projectsController from "../controllers/projectsController.js";

const projectsRouter = () => {
    const router = express.Router();

    router.get("/", projectsController.getProjects);
    router.get("/:projectId", projectsController.getProjectById);
    router.post("/", projectsController.createProject);
    router.put("/:projectId", projectsController.updateProject);
    router.delete("/:projectId", projectsController.deleteProject);

    return router;
};

export default projectsRouter;