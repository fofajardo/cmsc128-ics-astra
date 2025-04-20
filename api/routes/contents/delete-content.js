import express from "express";
import httpStatus from "http-status-codes";

// Helper function to validate UUID format 
const isValidUUID = (id) => {
    // Validates the UUID format 
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

const deleteContentRouter = (supabase) => {
    const router = express.Router();

    // DELETE /v1/contents/:contentId
    router.delete('/:contentId', async (req, res) => {
        try {
            // Extract contentId from request parameters
            const { contentId } = req.params;
            
            // Check if contentId is missing
            if (!contentId) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Missing contentId in params',
                });
            }

            // Validate if the contentId follows the correct UUID format
            if (!isValidUUID(contentId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format'
                });
            }

            // Check if content exists in the database
            const { data: existingContent, error: fetchError } = await supabase
                .from('contents')
                .select()
                .eq('id', contentId) // Look for content with matching contentId
                .single();

            // If content does not exist or fetch failed, return NOT_FOUND
            if (fetchError || !existingContent) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Content not found',
                });
            }

            // Delete the content from the database
            const { error: deleteError } = await supabase
                .from('contents')
                .delete()
                .eq('id', contentId); 

            // Handle any errors during deletion process
            if (deleteError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: deleteError.message
                });
            }

            // Return success message upon successful deletion
            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: `Content ${contentId} has been successfully deleted.`
            });

        } catch (error) {
            // Catch unexpected errors 
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message
            });
        }
    });

    // Return the router object to be used in the main application
    return router;
};

export default deleteContentRouter;
