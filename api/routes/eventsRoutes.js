import express from "express";
import eventsController from "../controllers/eventsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";
import {InferAbility} from "../middleware/inferAbility.js";
const eventsRouter = (supabase) => {
    const router = express.Router();

    router.get("/",  RequireAuthenticated, eventsController.getEvents(supabase));
    router.get("/:eventId",  RequireAuthenticated,eventsController.getEventById(supabase));
    router.post("/", RequireAuthenticated, eventsController.createEvent(supabase));
    router.put("/:eventId",RequireAuthenticated, eventsController.updateEvent(supabase));
    router.delete("/", RequireAuthenticated,eventsController.deleteEmptyEvent());
    router.delete("/:eventId", RequireAuthenticated, eventsController.deleteEvent(supabase));

    return router;
};

export default eventsRouter;