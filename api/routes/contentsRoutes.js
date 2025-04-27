import express from "express";
import contentsController from "../controllers/contentsController.js";

const contentsRouter = () => {
    const router = express.Router();

    router.get("/", contentsController.getContents);
    router.get("/:contentId", contentsController.getContentById);
    router.post("/", contentsController.createContent);
    router.put("/:contentId", contentsController.updateContent);
    router.delete("/:contentId", contentsController.deleteContent);

    return router;
};

export default contentsRouter;