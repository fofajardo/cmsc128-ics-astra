import express from 'express';
import httpStatus from 'http-status-codes';

// Function to validate UUID format
const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

// Function to validate Date format
const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

const postProjectsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            // Validate request body format and required fields
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
                (typeof req.body[field] === 'string' && req.body[field].trim() === '')
            );

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`,
                    id: null
                });
            }

            const {
                project_id,
                status,
                due_date,
                date_completed,
                goal_amount,
                donation_link
            } = req.body;

            const projectId = project_id;
            const dueDate = due_date;
            const dateCompleted = date_completed;
            const goalAmount = goal_amount;
            const donationLink = donation_link;

            // Validate data types
            if (!isValidUUID(projectId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid projectId format',
                    id: null
                });
            }

            // Invalid dateCompleted will result to null (invalid date objects serialized to null)
            if ((typeof status !== 'number' || ![0, 1, 2].includes(status)) ||
                !isValidDate(dueDate) ||
                (dateCompleted !== undefined && dateCompleted !== null && !isValidDate(dateCompleted)) ||
                typeof goalAmount !== 'number' ||
                typeof donationLink !== 'string'
            ) {
                return res.status(400).json({
                    status: 'FAILED',
                    message: 'Invalid field values',
                    id: null
                });
            }

            // Sanitize string fields
            const cleanDonationLink = donationLink.trim();

            // Insert data into the database
            const { data, error } = await supabase
                .from('projects')
                .insert({
                    project_id: projectId,
                    status: status,
                    due_date: dueDate,
                    date_completed: dateCompleted,
                    goal_amount: goalAmount,
                    donation_link: cleanDonationLink
                });

            // Catch duplicates or constraints
            if (error && error.code === '23503') {   // 23503 - fk key not found (contentId does not exist)
                return res.status(httpStatus.NOT_FOUND).json({
                    status: "FAILED",
                    message: error.message,
                    id: null
                });
            } else if (error && error.code === '23505') {    // 23505 - duplicate
                return res.status(httpStatus.CONFLICT).json({
                    status: "FAILED",
                    message: error.message,
                    id: null
                });
            }

            // Return appropriate response on successsful creation
            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Project successfully created',
                id: projectId
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error,
                id: null
            });
        }
    });

    return router;
};

export default postProjectsRouter;