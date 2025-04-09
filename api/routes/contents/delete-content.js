import express from "express";
import httpStatus from "http-status-codes";

const deleteContentRouter = (supabase) => {
    const router = express.Router();

    // DELETE /:contentId
    router.delete('/:contentId', async (req, res) => {
        try {
            const { contentId } = req.params;

            // Validate contentId
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(contentId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format'
                });
            }

            const { error } = await supabase
                .from('contents')
                .delete()
                .eq('id', contentId);

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: error.message
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: `Content ${contentId} has been deleted.`
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message
            });
        }
    });

    return router;
};

export default deleteContentRouter;
