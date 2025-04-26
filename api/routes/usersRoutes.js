import express from "express";
import usersController from "../controllers/usersController.js";
import { RequireAuthenticated } from "../middleware/requireAuthenticated.js";

const usersRouter = (supabase) => {
    const router = express.Router();
    
    router.use(RequireAuthenticated); // Applies to all routes below

    router.get("/", usersController.getUsers(supabase));
    router.get("/:userId", usersController.getUserById(supabase));
    router.post("/", usersController.createUser(supabase));
    router.put("/:userId", usersController.updateUser(supabase));
    router.delete("/:userId", usersController.deleteUser(supabase));

    return router;
};

export default usersRouter;