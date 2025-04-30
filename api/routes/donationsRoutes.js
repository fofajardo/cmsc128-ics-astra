import express from "express";
import donationsController from "../controllers/donationsController.js";

const donationsRouter = () => {
  const router = express.Router();

  router.get("/", donationsController.getDonations);
  router.get("/:donationId", donationsController.getDonationById);
  router.post("/", donationsController.createDonation);
  router.put("/:donationId", donationsController.updateDonation);
  router.delete("/:donationId", donationsController.deleteDonation);

  return router;
};

export default donationsRouter;