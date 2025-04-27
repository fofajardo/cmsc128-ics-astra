import express from "express";
import photosController from "../controllers/photosController.js";
import multer from "multer";
import { RequireAuthenticated } from "../middleware/requireAuthenticated.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "assets/photos/"); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`); // sample filename
    },
});

const upload = multer({ storage });

const photosRouter = (supabase) => {
    const router = express.Router();

    router.use(RequireAuthenticated);
    
    router.get("/", photosController.getAllPhotos(supabase));
    router.get("/:id", photosController.getPhotoById(supabase));
    router.post("/", upload.single("File"), photosController.uploadPhoto(supabase));
    router.put("/:id", photosController.updatePhoto(supabase));
    router.delete("/:id", photosController.deletePhoto(supabase));

    return router;
};

export default photosRouter;