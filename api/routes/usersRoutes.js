import express from "express";
import usersController from "../controllers/usersController.js";
import { RequireAuthenticated } from "../middleware/requireAuthenticated.js";

const usersRouter = () => {
  const router = express.Router();

  router.use(RequireAuthenticated); // Applies to all routes below

  router.get("/", usersController.getUsers);
  router.get("/inactive-alumni", usersController.getInactiveAlumni);
  router.get("/approved-alumni", usersController.getApprovedAlumni);
  router.get("/pending-alumni", usersController.getPendingAlumni);
  router.get("/:userId", usersController.getUserById);
  router.post("/", usersController.createUser);
  router.put("/:userId", usersController.updateUser);
  router.delete("/:userId", usersController.deleteUser);

  return router;
};

export default usersRouter;