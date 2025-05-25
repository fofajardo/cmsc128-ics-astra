import express from "express";
import photosController from "../controllers/photosController.js";
import multer from "multer";
import { RequireAuthenticated } from "../middleware/requireAuthenticated.js";

const photosRouter = (aUpload) => {
  const router = express.Router();

  router.get("/project/:project_id", photosController.getProjectPhotoByContentId);
  router.get("/event/:content_id", photosController.getEventPhotoByContentId);
  router.get("/alum/:alum_id", photosController.getPhotoByAlumId);
  router.get("/degree-proof/:alum_id", photosController.getDegreeProofPhotoByAlumId);
  router.get("/degree-proof/:alum_id/json", photosController.getJsonOfDegreeProofPhotoByAlumId);
  router.get("/jobs/:job_id", photosController.getJobPhotoByContentId);
  router.get("/content-types", photosController.getContentPhotoTypes);
  router.get("/by-content-id/:contentId", photosController.getPhotosByContentId);
  router.get("/donation-receipt", photosController.getDonationReceipt);
  router.get("/files", photosController.getFiles);
  router.get("/files/:id", photosController.getFileById);
  router.use(RequireAuthenticated);

  router.get("/profile-pics", photosController.getAllProfilePics);
  router.get("/", photosController.getAllPhotos);
  router.get("/:id", photosController.getPhotoById);
  router.post("/", aUpload.single("File"), photosController.uploadPhoto);
  router.put("/:id", aUpload.single("File"), photosController.updatePhoto);
  router.delete("/:id", photosController.deletePhoto);
  router.post("/newsletter", aUpload.single("File"), photosController.uploadNewsletter);
  router.delete("/newsletter/:id", photosController.deleteNewsletter);
  router.put("/event/:id", aUpload.single("File"), photosController.updateEventPhoto);
  return router;
};

export default photosRouter;