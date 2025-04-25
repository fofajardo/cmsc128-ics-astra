import express from "express";

const deleteDegreeRouter = (supabase) => {
    const router = express.Router();

    // Endpoint to delete a degree program by ID
    router.delete("/:id", async (req, res) => {
        const { id } = req.params;

        try {
        // Validate input
        if (!id) {
            return res.status(400).json({ error: "Degree program ID is required" });
        }

        // Delete the degree program from the database
        const { error } = await supabase
            .from("degree_programs")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting degree program:", error.message);
            throw error;
        }

        return res.status(200).json({ message: "Degree program deleted successfully" });
        } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ error: err.message });
        }
    });

    return router;
};

export default deleteDegreeRouter;