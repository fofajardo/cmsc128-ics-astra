import express from "express";

const putDegreeRouter = (supabase) => {
    const router = express.Router();

    // Endpoint to update a degree program by ID
    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { name, level } = req.body;

        try {
            // Validate input
            if (!id) {
                return res.status(400).json({ error: "Degree program ID is required" });
            }

            if (!name && !level) {
                return res.status(400).json({ error: "At least one field (name or level) is required to update" });
            }

            // Prepare the fields to update
            const updates = {};
            if (name) updates.name = name;
            if (level) updates.level = level;

            // Update the degree program in the database and request the updated rows
            const { data, error } = await supabase
                .from("degree_programs")
                .update(updates)
                .eq("id", id)
                .select(); // Explicitly request the updated rows

            if (error) {
                console.error("Error updating degree program:", error.message);
                throw error;
            }

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "Degree program not found" });
            }

            return res.status(200).json({
                message: "Degree program updated successfully",
                degree_program: data[0],
            });
        } catch (err) {
            console.error("Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    });

    return router;
};

export default putDegreeRouter;