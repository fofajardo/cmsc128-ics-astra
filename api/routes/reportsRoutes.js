import express from "express";
import reportsController from "../controllers/reportsController.js";

const reportsRouter = () => {
    const router = express.Router();

    router.get("/", reportsController.getReports);
    router.get("/:reportId", reportsController.getReportById);
    router.post("/", reportsController.createReport);
    router.put("/:reportId", reportsController.updateReport);
    router.delete("/:reportId", reportsController.deleteReport);

    return router;
};

export default reportsRouter;
