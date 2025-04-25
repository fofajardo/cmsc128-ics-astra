import express from "express";
import eventInterestsController from "../controllers/eventInterestsController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";

const eventInterestsRouter = (supabase) => {
    const router = express.Router();

    router.get("/",RequireAuthenticated,eventInterestsController.getEventInterests(supabase));
    router.get("/alumnus/:alumnId",RequireAuthenticated, eventInterestsController.getEventInterestByAlumnId(supabase));
    router.get("/content/:contentId",RequireAuthenticated, eventInterestsController.getEventInterestByContentId(supabase));
    router.post("/",  RequireAuthenticated, eventInterestsController.createEventInterest(supabase));
    router.delete("/",  RequireAuthenticated,eventInterestsController.deleteEmptyEventInterest());
    router.delete("/:alumId/:contentId", RequireAuthenticated,  eventInterestsController.deleteEventInterest(supabase));

    return router;
};

export default eventInterestsRouter;