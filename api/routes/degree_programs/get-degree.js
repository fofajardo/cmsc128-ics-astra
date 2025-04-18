import express from "express";

const getDegreeRouter = (supabase) => {
    const router = express.Router();

    // Endpoint to get all degree programs
    router.get("/", async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("degree_programs")
                .select("*");
    
            if (error) {
                console.error("Error fetching degree programs:", error.message);
                return res.status(500).json({ error: error.message });
            }
    
            if (!data || data.length === 0) {
                return res.status(404).json({ message: "No degree programs found" });
            }
    
            return res.status(200).json({ degree_programs: data });
        } catch (err) {
            console.error("Error:", err.message);
            if (err.name === "FetchError") {
                return res.status(500).json({ error: "Network error while connecting to Supabase" });
            }
            return res.status(500).json({ error: err.message });
        }
    });

    return router;
};

export default getDegreeRouter;