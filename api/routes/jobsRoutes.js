import express from "express";
import jobsController from "../controllers/jobsController.js";

const jobsRouter = () => {
    const router = express.Router();

    router.get("/", jobsController.getJobs);
    router.get("/:jobId", jobsController.getJobById);
    router.post("/", jobsController.createJob);
    router.put("/:jobId", jobsController.updateJob);
    router.delete("/:jobId", jobsController.deleteJob);

    return router;
};

export default jobsRouter;