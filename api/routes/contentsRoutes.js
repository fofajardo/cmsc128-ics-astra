import express from "express";
import contentsController from "../controllers/contentsController";

const contentsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", contentsController.getContents(supabase));
    router.get("/:contentId", contentsController.getContentById(supabase));
    router.post("/", contentsController.createContent(supabase));
    router.put("/:contentId", contentsController.updateContent(supabase));
    router.delete("/:contentId", contentsController.deleteContent(supabase));

    return router;
};

export default contentsRouter;