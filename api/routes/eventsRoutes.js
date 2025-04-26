import express from "express";
import eventsController from "../controllers/eventsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";

const eventsRouter = (supabase) => {
    const router = express.Router();

    router.use(RequireAuthenticated);
    router.get("/", eventsController.getEvents(supabase));
    router.get("/:eventId", eventsController.getEventById(supabase));
    router.post("/", eventsController.createEvent(supabase));
    router.put("/:eventId", eventsController.updateEvent(supabase));
    router.delete("/",eventsController.deleteEmptyEvent());
    router.delete("/:eventId",  eventsController.deleteEvent(supabase));

    return router;
};

export default eventsRouter;