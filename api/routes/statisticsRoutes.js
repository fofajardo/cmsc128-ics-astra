import express from "express";
import statisticsController from "../controllers/statisticsController.js";

const statisticsRouter = () => {
  const router = express.Router();

  router.get("/active-alumni", statisticsController.getActiveAlumniStats);
  router.get("/active-jobs", statisticsController.getActiveJobsStats);
  router.get("/active-events", statisticsController.getActiveEventsStats);
  router.get("/funds-raised", statisticsController.getFundsRaisedStats);

  return router;
}

export default statisticsRouter;