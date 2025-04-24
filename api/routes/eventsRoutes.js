import express from "express";
import eventsController from "../controllers/eventsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";
import {InferAbility} from "../middleware/inferAbility.js";
const eventsRouter = (supabase) => {
    const router = express.Router();

    router.get("/",  RequireAuthenticated, InferAbility, eventsController.getEvents(supabase));
    router.get("/:eventId",  RequireAuthenticated, InferAbility,eventsController.getEventById(supabase));
    router.post("/", RequireAuthenticated, InferAbility, eventsController.createEvent(supabase));
    router.put("/:eventId",RequireAuthenticated, InferAbility, eventsController.updateEvent(supabase));
    router.delete("/", RequireAuthenticated, InferAbility,eventsController.deleteEmptyEvent());
    router.delete("/:eventId", RequireAuthenticated, InferAbility, eventsController.deleteEvent(supabase));

    return router;
};

export default eventsRouter;