import express from "express";
import degreeProgramController from "../controllers/degreeProgramController.js";
import {RequireAuthenticated} from "../middleware/requireAuthenticated.js";

const degreeProgramsRouter = (supabase) => {
  const router = express.Router();

  router.use(RequireAuthenticated);

  router.get("/alumni/:id", degreeProgramController.getDegreeProgramsByUserId);
  // router.get("/alumni/:year_graduated", degreeProgramController.getAlumniByYearGraduated);
  router.get("/:id", degreeProgramController.getDegreeProgramById);
  router.get("/", degreeProgramController.getAllDegreePrograms);
  router.post("/", degreeProgramController.createDegreeProgram);
  router.put("/:id", degreeProgramController.updateDegreeProgram);
  router.delete("/:id", degreeProgramController.deleteDegreeProgram);

  return router;
};

export default degreeProgramsRouter;