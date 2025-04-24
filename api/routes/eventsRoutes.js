import express from "express";
import eventsController from "../controllers/eventsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";
import {InferAbility} from "../middleware/inferAbility.js";
const eventsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", eventsController.getEvents(supabase));
    router.get("/:eventId", eventsController.getEventById(supabase));
    router.post("/", eventsController.createEvent(supabase));
    router.put("/:eventId", eventsController.updateEvent(supabase));
    router.delete("/", eventsController.deleteEmptyEvent());
    router.delete("/:eventId",RequireAuthenticated,InferAbility, eventsController.deleteEvent(supabase));

    return router;
};

export default eventsRouter;