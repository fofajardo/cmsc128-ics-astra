import express from 'express';
import httpStatus from 'http-status-codes';

const getContentsRouter = (supabase) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from('contents')
                .select()
                .range(startIndex, endIndex);

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: error.message,
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'OK',
                list: data || [],
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }
    });

    // GET /v1/contents/:contentId
    router.get('/:contentId', async (req, res) => {
        try {
            const { contentId } = req.params;
            
            //Check if content is valid content Id
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(userId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format'
                });
            }
            
            const { data, error } = await supabase
                .from('contents')
                .select('content_id, alum_id, title, details, created_at')
                .eq('content_id', contentId)
                .single();

            if (error || !data) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Content not found',
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'OK',
                content: data,
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }
    });

    return router;
};

export default getContentsRouter;
