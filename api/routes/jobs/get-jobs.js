import express from 'express';
import httpStatus from 'http-status-codes';

const getJobsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from("jobs")
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

    router.get("/:jobId", async (req, res) => {
        try {
            const { jobId } = req.params;

            const { data, error } = await supabase
                .from("jobs")
                .select(
                    "job_title, hiring_manager, company_name, salary, apply_link"
                )
                .eq("job_id", jobId)
                .single();

            if (error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: "job not found"
                });
            }

            console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                job: data
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

export default getJobsRouter;