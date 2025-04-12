import express from 'express';
import httpStatus from 'http-status-codes';

const getEventInterestsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from("event_interests")
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

    // GET all the event interests of an alumnus
    router.get("/alumnus/:alumnId", async (req, res) => {
        try {
            const { alumnId } = req.params;

            const { data, error } = await supabase
                .from("event_interests")
                .select("content_id")
                .eq("alum_id", alumnId);

            if (error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: "No contents in event interests found"
                });
            }

            console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                list: data || []
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }
    });


    router.get("/content/:contentId", async (req, res) => {
        try {
            const { contentId } = req.params;

            const { data, error } = await supabase
                .from("event_interests")
                .select("alum_id")
                .eq("content_id", contentId);

            if (error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: "No alumni in event interests found"
                });
            }

            console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                list: data || []
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

export default getEventInterestsRouter;