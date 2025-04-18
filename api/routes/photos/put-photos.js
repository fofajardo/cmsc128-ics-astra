import express from "express";
import multer from "multer";

const putPhotosRouter = (supabase) => {
  const router = express.Router();
  const BUCKET = "user-photos-bucket";

  // Configure multer for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  // Replace an image in Supabase Storage by filename
  router.put("/:filename", upload.single("File"), async (req, res) => {
    const oldFilename = req.params.filename;
    const file = req.file; // New file to replace the old one

    try {
      if (!file) {
        return res.status(400).json({ error: "No file provided for replacement" });
      }

      // Step 1: Delete the old file from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([oldFilename]);

      if (storageError) {
        console.error("Error deleting old file from storage:", storageError.message);
        throw storageError;
      }

      // Step 2: Upload the new file to Supabase Storage
      const uniqueName = `${Date.now()}-${file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(uniqueName, file.buffer, {
          contentType: file.mimetype, // Specify the MIME type
        });

      if (uploadError) {
        console.error("Error uploading new file:", uploadError.message);
        throw uploadError;
      }

      return res.status(200).json({
        message: "File replaced successfully",
        new_image_key: uniqueName,
      });
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
};

export default putPhotosRouter;