import express from 'express';
import httpStatus from 'http-status-codes';

const postContentRouter = (supabase) => {
    const router = express.Router();

    // POST /v1/contents - Create new content
    router.post('/', async (req, res) => {
        try {
            // Define allowed fields for validation
            const allowedFields = [
                "user_id",
                "title",
                "details",
                "created_at",
                "updated_at"
            ];
            // Define required fields for validation (created_at and updated_at are not required)
            const requiredFields = [
                "user_id",
                "title",
                "details"
            ];

            // Function to validate UUID format
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            // Get all the fields received in the request body
            const receivedFields = Object.keys(req.body);

            // Validate user_id is a valid UUID
            if (req.body.user_id && !isValidUUID(req.body.user_id)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid user_id format — must be a valid UUID'
                });
            }

            // Check for missing required fields or blank fields
            const missingFields = requiredFields.filter(field =>
                !req.body[field] || req.body[field].toString().trim() === ''
            );

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }

            // Check for unexpected fields (extra fields not in allowedFields)
            const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
            if (extraFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Unexpected fields: ${extraFields.join(", ")}`
                });
            }

            // Prepare content data for insertion into the database
            const {
                user_id,
                title,
                details,
                created_at = new Date().toISOString(),  // Default to current date if not provided
                updated_at = new Date().toISOString(),  // Default to current date if not provided
            } = req.body;

            // Insert content into the contents table in Supabase
            const { data, error } = await supabase
                .from('contents')
                .insert({
                    user_id,
                    title,
                    details,
                    created_at,  // Will be set to current date if not provided
                    updated_at   // Will be set to current date if not provided
                })
                .select()
                .single();  // Retrieve the inserted content object

            // If there was an error inserting the content, return a 500 error
            if (error) {
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error.message || error
                });
            }

            // Return a success response with the created content
            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Content successfully created',
                content: data
            });

        } catch (error) {
            // Catch any unexpected errors and return a 500 error
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message || error
            });
        }
    });

    return router;
};

export default postContentRouter;
