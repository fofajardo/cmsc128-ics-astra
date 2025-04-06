import express from 'express';
import httpStatus from 'http-status-codes';

const getUsersRouter = (supabase) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from("users")
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

    router.get("/:userId", async (req, res) => {
        try {
            const { userId } = req.params;

            console.log(userId);

            const { data, error } = await supabase
                .from("users")
                .select(
                    "role, username, email, password, salt, is_enabled, first_name, middle_name, last_name, created_at, deleted_at"
                )
                .eq("id", userId)
                .single();

            if (error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: "User not found"
                });
            }

            // console.log(data);

            return res.status(httpStatus.OK).json({
                status: "OK",
                user: data
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

export default getUsersRouter;