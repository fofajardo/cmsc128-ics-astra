import express from 'express';
import httpStatus from 'http-status-codes';

const postContentRouter = (supabase) => {
    const router = express.Router();

    router.post('/:contentId', async (req, res) => {
        try {
            const userId = req.params.userId;

            // Check if contentId is valid
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(userId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format'
                });
            }

            // Check required fields for content
            const requiredFields = [
                "alumid",
                "title",
                "details"
            ];

            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }

            //Prepare content data for insertion
            const {
                alumid,
                title,
                details,
                createdAt = new Date().toISOString(), // Default to current date if not provided
                updatedAt = new Date().toISOString()  // Default to current date if not provided
            } = req.body;


            const { data, error } = await supabase
                .from('contents')
                .insert({
                    alumid: alumid,
                    title: title,
                    details: details,
                    created_at: createdAt,
                    updated_at: updatedAt
                });

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error.message || error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Content successfully created',
                id: data[0]?.id // Assuming the content ID is returned after insertion
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message || error
            });
        }
    });

    return router;
};

export default postContentRouter;
