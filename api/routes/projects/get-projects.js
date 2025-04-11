import express from 'express';
import httpStatus from 'http-status-codes';

const getProjectsRouter = (supabase) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from("projects")
                .select()
                .range(startIndex, endIndex);

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error.message
                });
            }

            // console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                projects: data || [],
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }
    });

    router.get("/:projectId", async (req, res) => {
        try {
            const { projectId } = req.params;

            const { data, error } = await supabase
                .from("projects")
                .select(
                    "project_id, status, due_date, date_completed, goal_amount, donation_link"
                )
                .eq("project_id", projectId)
                .single();

            if (error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: "Project not found"
                });
            }

            // console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                project: data
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }
    });

    router.get("/:projectId/donations", async (req, res) => {
        try {
            const { projectId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from("donations")
                .select(
                    "id, alum_id, project_id, donation_date, reference_num, mode_of_payment, amount"
                )
                .eq("project_id", projectId)
                .range(startIndex, endIndex);

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error.message
                });
            }

            // console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                donations: data || [],
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

export default getProjectsRouter;