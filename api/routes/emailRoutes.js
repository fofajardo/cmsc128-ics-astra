import express from "express";
import emailService from "../controllers/emailController.js";

const emailRouter = () => {
  const router = express.Router();

  router.post("/send", emailService.sendEmail);

  return router;
};

export default emailRouter;