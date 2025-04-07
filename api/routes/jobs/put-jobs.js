import express from "express";

export default function putJobsRouter(supabase) {
    const router = express.Router();

    // put request to update a job
    router.put("/:jobId", async (req, res) => {
        const jobId = req.params.jobId;
        const data = req.body;

        try {
            const { error } = await supabase
                .from("jobs")
                .update(data)
                .eq("id", jobId);

            if (error) {
                return res.status(500).json({
                    message: "Failed to update job",
                    error: error.message,
                });
            }

            res.status(200).json({
                message: `Job ${jobId} updated successfully`,
                data,
            });
        } catch (err) {
            res.status(500).json({
                message: "Unexpected error occurred",
                error: err.message,
            });
        }
    });

    return router;
}
