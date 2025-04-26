import express from "express";
import donationsController from "../controllers/donationsController.js";

const donationsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", donationsController.getDonations(supabase));
    router.get("/:donationId", donationsController.getDonationById(supabase));
    router.post("/", donationsController.createDonation(supabase));
    router.put("/:donationId", donationsController.updateDonation(supabase));
    router.delete("/:donationId", donationsController.deleteDonation(supabase));

    return router;
};

export default donationsRouter;