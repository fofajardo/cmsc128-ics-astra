import express from 'express';
import httpStatus from 'http-status-codes';

const getEventsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from("events")
                .select()
                .range(startIndex, endIndex);

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error.message
                });
            }

            console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                list: data || [],
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }
    });

    router.get("/:eventId", async (req, res) => {
        try {
            const { eventId } = req.params;

            const { data, error } = await supabase
                .from("events")
                .select(
                    "event_date, venue, external_link, access_link, interested_count, going_count, not_going_count, online"
                )
                .eq("event_id", eventId)
                .single();

            if (error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: "event not found"
                });
            }

            console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                event: data
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }
    });

    return router;
};

export default getEventsRouter;