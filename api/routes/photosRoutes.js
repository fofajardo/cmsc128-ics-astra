import express from "express";
import photosController from "../controllers/photosController.js";
import multer from "multer";
import { RequireAuthenticated } from "../middleware/requireAuthenticated.js";

const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, "assets/photos/"); // Directory where files will be stored
    // },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`); // sample filename
    },
});

const upload = multer({ storage });

const photosRouter = () => {
    const router = express.Router();

    router.use(RequireAuthenticated);

    router.get("/alum/:alum_id", photosController.getPhotoByAlumId);
    router.get("/profile-pics", photosController.getAllProfilePics);
    router.get("/", photosController.getAllPhotos);
    router.get("/:id", photosController.getPhotoById);
    router.post("/", upload.single("File"), photosController.uploadPhoto);
    router.put("/:id", upload.single("File"), photosController.updatePhoto);
    router.delete("/:id", photosController.deletePhoto);

    return router;
};

export default photosRouter;