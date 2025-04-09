import express from 'express';
import httpStatus from 'http-status-codes';

const putContentRouter = (supabase) => {
    const router = express.Router();

    // PUT /v1/contents/:contentId
    router.put('/:contentId', async (req, res) => {
        try {
            const { contentId } = req.params;

            if (!contentId) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Missing contentId in params',
                });
            }

            const allowedFields = ['title', 'details'];
            const updateData = {};

            for (const field of allowedFields) {
                if (req.body[field]) {
                    updateData[field] = req.body[field];
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'No valid fields provided for update',
                });
            }

            const { data, error } = await supabase
                .from('contents')
                .update(updateData)
                .eq('content_id', contentId)
                .select()
                .single();

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: error.message,
                });
            }

            if (!data) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Content not found',
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'UPDATED',
                message: 'Content updated successfully',
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

export default putContentRouter;
