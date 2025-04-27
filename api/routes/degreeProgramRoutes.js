import express from "express";
import degreeProgramController from "../controllers/degreeProgramController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";

const degreeProgramsRouter = (supabase) => {
    const router = express.Router();

    router.use(RequireAuthenticated);
    
    router.get("/", degreeProgramController.getAllDegreePrograms(supabase));
    router.get("/:id", degreeProgramController.getDegreeProgramById(supabase));
    router.post("/", degreeProgramController.createDegreeProgram(supabase));
    router.put("/:id", degreeProgramController.updateDegreeProgram(supabase));
    router.delete("/:id", degreeProgramController.deleteDegreeProgram(supabase));

    return router;
};

export default degreeProgramsRouter;