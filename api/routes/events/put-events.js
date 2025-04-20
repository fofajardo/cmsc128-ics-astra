import express from "express";

export default function putEventsRouter(supabase) {
    const router = express.Router();

    // [ut request to update an event
    router.put("/:eventId", async (req, res) => {
        const eventId = req.params.eventId;
        const data = req.body;

        try {
            const { error } = await supabase
                .from("events")
                .update(data)
                .eq("id", eventId);

            if (error) {
                return res.status(500).json({
                    message: "Failed to update event",
                    error: error.message,
                });
            }

            res.status(200).json({
                message: `Event ${eventId} updated successfully`,
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
