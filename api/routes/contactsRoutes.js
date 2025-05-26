import express from "express";
import contactsController from "../controllers/contactsController.js";
import { RequireAuthenticated } from "../middleware/requireAuthenticated.js";

const contactsRoutes = () => {
  const router = express.Router();

  router.use(RequireAuthenticated);

  router.get("/user/:id", contactsController.getContactsByUserId);
  router.get("/:id", contactsController.getContactById);
  router.get("/", contactsController.getAllContacts);
  router.post("/", contactsController.createContact);
  router.put("/:id", contactsController.updateContact);
  router.delete("/:id", contactsController.deleteContact);

  return router;
};

export default contactsRoutes;