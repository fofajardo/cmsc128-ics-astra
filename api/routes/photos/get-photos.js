import express from "express";

const getPhotosRouter = (supabase) => {
  const router = express.Router();
  const BUCKET = "user-photos-bucket";

  // Get all contents in the bucket
  router.get("/", async (req, res) => {
    try {
      // List all files in the bucket
      const { data: files, error } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: 100 }); // Adjust the limit as needed

      if (error) {
        console.error("Error fetching files:", error.message);
        return res.status(500).json({ error: error.message });
      }

      if (!files || files.length === 0) {
        return res.status(404).json({ message: "No files found in the bucket" });
      }

      // Map the files to include their public URLs
      const fileUrls = files.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(file.name);
        return {
          name: file.name,
          url: publicUrlData.publicUrl,
        };
      });

      return res.status(200).json({ files: fileUrls });
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
};

export default getPhotosRouter;