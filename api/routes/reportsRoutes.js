import express from "express";
import reportsController from "../controllers/reportsController.js";

const reportsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", reportsController.getReports(supabase));
    router.get("/:reportId", reportsController.getReportById(supabase));
    router.post("/", reportsController.createReport(supabase));
    router.put("/:reportId", reportsController.updateReport(supabase));
    router.delete("/:reportId", reportsController.deleteReport(supabase));

    return router;
};

export default reportsRouter;
