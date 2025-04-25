import express from "express";
import multer from "multer";

const uploadImageRouter = (supabase) => {
    const router = express.Router();
    const upload = multer({ storage: multer.memoryStorage() });

    const BUCKET = "user-photos-bucket";

    router.post("/", upload.single("File"), async (req, res) => {
        console.log("Received request for image upload");
        try {
            console.log("File:", req.file);
            console.log("Body:", req.body);
            const file = req.file;
            const { user_id, content_id } = req.body; // Extract user_id and content_id from the request body

            if (!file || (!user_id && !content_id)) {
                return res.status(400).json({ error: "Missing file or required metadata" });
            }

            // Generate a unique name for the file
            const uniqueName = `${Date.now()}-${file.originalname}`;

            // Upload the file to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(BUCKET)
                .upload(uniqueName, file.buffer, {
                    contentType: file.mimetype, // Specify the MIME type
                });

            if (uploadError) throw uploadError;

            // Get the public URL of the uploaded file
            const { data: publicUrlData } = await supabase.storage
                .from(BUCKET)
                .getPublicUrl(uniqueName);

            // Insert the file metadata into the 'photos' table
            const { error: dbError } = await supabase
                .from("photos")
                .insert([
                    {
                        id: crypto.randomUUID(), // Generate a unique ID for the photo
                        user_id, // Use the user_id from the request body
                        content_id, // Use the content_id from the request body
                        image_key: uniqueName, // Store the unique file name as the image key
                    },
                ]);

            if (dbError) throw dbError;

            // Return a success response
            return res.status(200).json({
                message: "Image uploaded and recorded successfully",
                url: publicUrlData.publicUrl, // Return the public URL of the uploaded file
                image_key: uniqueName, // Return the unique file name in the response
            });
        } catch (err) {
            console.error("Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    });

    return router;
};

export default uploadImageRouter;