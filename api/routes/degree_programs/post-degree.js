import express from "express";
import { v4 as uuidv4 } from "uuid";

const postDegreeRouter = (supabase) => {
    const router = express.Router();

    // Endpoint to create a new degree program
    router.post("/", async (req, res) => {
        const { name, level } = req.body;
    
        try {
            // Validate input
            if (!name || !level) {
                return res.status(400).json({ error: "Name and level are required" });
            }
    
            // Insert the new degree program into the database
            const { data, error } = await supabase
                .from("degree_programs")
                .insert([
                    {
                        id: uuidv4(),
                        name,
                        level,
                    },
                ])
                .select();
    
            console.log("Supabase response:", { data, error });
    
            if (error) {
                console.error("Error inserting degree program:", error.message);
                throw error;
            }
    
            if (!data || data.length === 0) {
                return res.status(500).json({ error: "Failed to insert degree program" });
            }
    
            return res.status(201).json({
                message: "Degree program created successfully",
                degree_program: data[0],
            });
        } catch (err) {
            console.error("Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    });

    return router;
};

export default postDegreeRouter;