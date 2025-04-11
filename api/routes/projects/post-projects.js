import express from 'express';
import httpStatus from 'http-status-codes';

const postProjectsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            // check required fields
            const requiredFields = [
                'project_id',
                'status',
                'due_date',
                // 'date_completed',
                'goal_amount',
                'donation_link'
            ];

            const missingFields = requiredFields.filter(field =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                req.body[field] === ''
            );

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`,
                    id: ''
                });
            }

            // insert data to supabase
            const {
                project_id,
                status,
                due_date,
                date_completed,
                goal_amount,
                donation_link
            } = req.body;

            const { data, error } = await supabase
                .from('projects')
                .insert({
                    project_id: project_id,
                    status: status,
                    due_date: due_date,
                    date_completed: date_completed,
                    goal_amount: goal_amount,
                    donation_link: donation_link
                });

            if (error.code === '23503') {   // 23503 - fk key not found
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: error.message,
                    id: ''
                });
            } else if (error.code === '23505') {    // 23505 - duplicate
                return res.status(httpStatus.CONFLICT).json({
                    status: "FAILED",
                    message: error.message,
                    id: ''
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Project successfully created',
                id: project_id
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error,
                id: ''
            });
        }
    });

    return router;
};

export default postProjectsRouter;