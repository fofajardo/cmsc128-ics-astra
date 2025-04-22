import express from "express";

const deletePhotosRouter = (supabase) => {
    const router = express.Router();
    const BUCKET = "user-photos-bucket";

    // Delete an image by filename
    router.delete("/:filename", async (req, res) => {
        const filename = req.params.filename;

        try {
        // Step 1: Delete the file from Supabase Storage
        const { error: storageError } = await supabase.storage
            .from(BUCKET)
            .remove([filename]);

        if (storageError) {
            console.error("Error deleting file from storage:", storageError.message);
            throw storageError;
        }

        // Step 2: Delete the corresponding record from the 'photos' table
        const { error: dbError } = await supabase
            .from("photos")
            .delete()
            .eq("image_key", filename);

        if (dbError) {
            console.error("Error deleting record from database:", dbError.message);
            throw dbError;
        }

        return res.status(200).json({ message: "Image deleted from storage and database successfully" });
        } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ error: err.message });
        }
    });

    return router;
};

export default deletePhotosRouter;