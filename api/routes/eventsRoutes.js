import express from "express";
import eventsController from "../controllers/eventsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";

const eventsRouter = () => {
  const router = express.Router();

  router.use(RequireAuthenticated);
  router.get("/", eventsController.getEvents);
  router.get("/active-events", eventsController.getActiveEvents)
  router.get("/:eventId", eventsController.getEventById);
  router.post("/", eventsController.createEvent);
  router.put("/:eventId", eventsController.updateEvent);
  router.delete("/",eventsController.deleteEmptyEvent);
  router.delete("/:eventId",  eventsController.deleteEvent);

  return router;
};

export default eventsRouter;