import express from "express";
import statisticsController from "../controllers/statisticsController.js";

const statisticsRouter = () => {
  const router = express.Router();

  router.get("/active-alumni", statisticsController.getActiveAlumniStats);
  router.get("/active-jobs", statisticsController.getActiveJobsStats);
  router.get("/active-events", statisticsController.getActiveEventsStats);
  router.get("/funds-raised", statisticsController.getFundsRaisedStats);
  router.get("/upcoming-events", statisticsController.getUpcomingEvents);
  router.get("/project-donation-summary", statisticsController.getProjectDonationSummary);
  router.get("/events-summary", statisticsController.getEventsSummary);

  return router;
};

export default statisticsRouter;