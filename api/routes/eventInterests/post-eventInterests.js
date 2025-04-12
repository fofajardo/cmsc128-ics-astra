import express from 'express';
import httpStatus from 'http-status-codes';

const postEventInterestsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const {alumId, contentId} = req.body;

            // Check if userId valid
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(alumId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid alumId format'
                });
            }
            if (!isValidUUID(contentId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid contentId format'
                });
            }


            // insert data to supabase
            const {
                alum_id,
                content_id
            } = req.body;

            const { data, error } = await supabase
                .from('event_interests')
                .insert({
                    alum_id: alum_id,
                    contentId: content_id
                });

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Event Interest successfully created',
                id: userId
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