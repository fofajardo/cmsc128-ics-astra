import express from 'express';
import httpStatus from 'http-status-codes';

// Function to validate UUID format       
const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  };

const putContentRouter = (supabase) => {
    const router = express.Router();

    // PUT /v1/contents/:contentId
    router.put('/:contentId', async (req, res) => {
        try {
            const { contentId } = req.params;

            // Check if contentId exists in the request params
            if (!contentId) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Missing contentId in params',
                });
            }

            // Validate if contentId is a valid UUID
            if (!isValidUUID(contentId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format',
                });
            }

            // Check if the content exists in the database
            const { data: existingContent, error: fetchError } = await supabase
                .from('contents')
                .select()
                .eq('id', contentId)
                .single();

            // If content does not exist, return NOT_FOUND
            if (fetchError || !existingContent) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Content not found',
                });
            }


            // Prevent update of user_id
            if (req.body.user_id) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Updating user_id is not allowed',
                });
            }

            // Allowed fields for content update
            const allowedFields = ['title', 'details'];
            const updateData = {};
            
            // Check if title is provided and not empty
            if (req.body.title === '' || (req.body.title && req.body.title.trim() === '')) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Title cannot be empty',
                });
            }

            // Check if details are provided and not empty
            if (req.body.details === '' || (req.body.details && req.body.details.trim() === '')) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Details cannot be empty',
                });
            }

            // Loop through allowed fields and add them to the updateData object if present
            for (const field of allowedFields) {
                if (req.body[field]) {
                    updateData[field] = req.body[field];
                }
            }

            // Ensure that at least one valid field is provided for update
            if (Object.keys(updateData).length === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'No valid fields provided for update',
                });
            }

            // Update content in the database
            const { data, error } = await supabase
                .from('contents')
                .update(updateData)
                .eq('id', contentId)
                .select()
                .single();

            // Handle error during database update
            if (error) {
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: error.message,
                });
            }

            // Return success response with updated content
            return res.status(httpStatus.OK).json({
                status: 'UPDATED',
                message: 'Content updated successfully',
                content: data,
            });

        } catch (error) {
            // Catch any other unexpected errors
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }
    });

    return router;
};

export default putContentRouter;
