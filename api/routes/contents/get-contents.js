import express from 'express';
import httpStatus from 'http-status-codes';

const getContentsRouter = (supabase) => {
    const router = express.Router();

    // GET /v1/contents - Retrieves all contents
    router.get('/', async (req, res) => {
        try {
            // Extract page parameters from query, default to page 1 and limit 10
            const { page = 1, limit = 10 } = req.query;
            
            // Calculate range 
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            // Query the contents table with pagination
            const { data, error } = await supabase
                .from('contents')
                .select()
                .range(startIndex, endIndex);

            // Handle errors from the Supabase query
            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: error.message,
                });
            }

            // Return the data if the request is successful
            return res.status(httpStatus.OK).json({
                status: 'OK',
                list: data || [], // Return an empty array if no data found
            });

        } catch (error) {
            // Catch any unexpected errors
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }
    });

    // GET /v1/contents/:contentId - Retrieves a single content item by its ID
    router.get('/:contentId', async (req, res) => {
        try {
            const { contentId } = req.params;

            // Helper function to validate UUID format
            const isValidUUID = (id) => {
                // Validate the contentId format to ensure it's a valid UUID
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            // Check if the contentId is a valid UUID
            if (!isValidUUID(contentId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format',
                });
            }

            // Query the contents table to fetch content by contentId
            const { data, error } = await supabase
                .from('contents')
                .select('id, user_id, title, details, created_at, updated_at') // Specify fields to select
                .eq('id', contentId) 
                .single(); // Ensure only a single record is returned

            // Handle error or no content found
            if (error || !data) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Content not found',
                });
            }

            // Return the content if found
            return res.status(httpStatus.OK).json({
                status: 'OK',
                content: data,
            });

        } catch (error) {
            // Catch any unexpected errors
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }
    });

    return router;
};

export default getContentsRouter;
