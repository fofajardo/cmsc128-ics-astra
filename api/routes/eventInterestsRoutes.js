import express from "express";
import eventInterestsController from "../controllers/eventInterestsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";

const eventInterestsRouter = () => {
  const router = express.Router();

  router.use(RequireAuthenticated);
  router.get("/", eventInterestsController.getEventInterests);
  router.get("/alumnus/:alumnId", eventInterestsController.getEventInterestByAlumnId);
  router.get("/content/:contentId", eventInterestsController.getEventInterestByContentId);
  router.get("/:contentId", eventInterestsController.getEventInterestStats);
  router.post("/", eventInterestsController.createEventInterest);
  router.delete("/", eventInterestsController.deleteEmptyEventInterest);
  router.delete("/:alumId/:contentId", eventInterestsController.deleteEventInterest);

  return router;
};

export default eventInterestsRouter;