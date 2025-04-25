import express from "express";
import eventInterestsController from "../controllers/eventInterestsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";

const eventInterestsRouter = (supabase) => {
    const router = express.Router();

    router.get("/",eventInterestsController.getEventInterests(supabase));
    router.get("/alumnus/:alumnId", eventInterestsController.getEventInterestByAlumnId(supabase));
    router.get("/content/:contentId", eventInterestsController.getEventInterestByContentId(supabase));
    router.post("/",  eventInterestsController.createEventInterest(supabase));
    router.delete("/",  eventInterestsController.deleteEmptyEventInterest());
    router.delete("/:alumId/:contentId", RequireAuthenticated,  eventInterestsController.deleteEventInterest(supabase));

    return router;
};

export default eventInterestsRouter;