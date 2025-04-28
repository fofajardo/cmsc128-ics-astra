import express from "express";
import jobsController from "../controllers/jobsController.js";

const jobsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", jobsController.getJobs(supabase));
    router.get("/:jobId", jobsController.getJobById(supabase));
    router.post("/", jobsController.createJob(supabase));
    router.put("/:jobId", jobsController.updateJob(supabase));
    router.delete("/:jobId", jobsController.deleteJob(supabase));

    return router;
};

export default jobsRouter;