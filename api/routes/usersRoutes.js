import express from "express";
import usersController from "../controllers/usersController.js";
import { RequireAuthenticated } from "../middleware/requireAuthenticated.js";
import degreeProgramsController from "../controllers/degreeProgramController.js";
import alumniProfilesController from "../controllers/alumniProfilesController.js";

const usersRouter = () => {
  const router = express.Router();

  router.use(RequireAuthenticated); // Applies to all routes below

  router.get("/", usersController.getUsers);
  router.get("/inactive-alumni", usersController.getInactiveAlumni);
  router.get("/:userId", usersController.getUserById);
  router.get("/:id/degree-programs", degreeProgramsController.getDegreeProgramsByUserId);
  router.get("/:userId/profile", alumniProfilesController.getAlumniProfilesById);
  router.get("/:userId/profile/latest", alumniProfilesController.getAlumniProfileById);
  router.post("/", usersController.createUser);
  router.put("/:userId", usersController.updateUser);
  router.delete("/:userId", usersController.deleteUser);

  return router;
};

export default usersRouter;