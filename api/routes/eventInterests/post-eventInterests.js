import express from 'express';
import httpStatus from 'http-status-codes';

const postEventInterestsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const {alumnId, contentId} = req.body;

            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(alumnId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid alumnId format'
                });
            }

            if (!isValidUUID(contentId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format'
                });
            }

            const { data, error } = await supabase
                .from('event_interests')
                .insert({
                    alumn_id: alumnId,
                    content_id: contentId
                });

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error.message
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Event Interest successfully created',
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }
    });

    return router;
};

export default postEventInterestsRouter;