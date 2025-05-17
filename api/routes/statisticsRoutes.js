import express from "express";
import statisticsController from "../controllers/statisticsController.js";

const statisticsRouter = () => {
  const router = express.Router();

  router.get("/alumni-stats", statisticsController.getAlumniStats);
  router.get("/active-alumni", statisticsController.getActiveAlumniStats);
  router.get("/active-jobs", statisticsController.getActiveJobsStats);
  router.get("/active-events", statisticsController.getActiveEventsStats);
  router.get("/funds-raised", statisticsController.getFundsRaisedStats);
  router.get("/upcoming-events", statisticsController.getUpcomingEvents);
  router.get("/project-donation-summary", statisticsController.getProjectDonationSummary);
  router.get("/project-contributors", statisticsController.getProjectContributors);
  router.get("/alumni-sex-stats", statisticsController.getAlumniSexStats);
  router.get("/alumni-age-stats", statisticsController.getAlumniAgeStats);
  router.get("/alumni-civil-status-stats", statisticsController.getAlumniCivilStatusStats);
  router.get("/alumni-org-affiliation-stats", statisticsController.getAlumniOrgAffiliationStats);
  router.get("/alumni-field-stats", statisticsController.getAlumniFieldStats);
  router.get("/alumni-highest-degree-stats", statisticsController.getAlumniHighestDegreeStats);
  router.get("/alumni-income-range-stats", statisticsController.getAlumniIncomeRangeStats);
  router.get("/alumni-employment-status", statisticsController.getAlumniEmploymentStatus);
  router.get("/alumni-batch", statisticsController.getAlumniBatch);
  router.get("/interested-alumni-email", statisticsController.getInterestedAlumniEmail);

  return router;
};

export default statisticsRouter;