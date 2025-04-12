import express from "express";
import httpStatus from "http-status-codes";

const deleteEventInterestsRouter = (supabase) => {
    const router = express.Router();

    router.delete('/:alumId/:contentId', async (req, res) => {
        try {

            const {alumId,contentId}  = req.params;

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

            const { data: existingAlumnus, error: fetchError } = await supabase
                .from('event_interests')
                .select()
                .eq('alum_id', alumId)
                .single();
            if (fetchError || !existingAlumnus) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Alumnus not found',
                });
            }
            const { data: existingContent, error: fetchErrors } = await supabase
                .from('event_interests')
                .select()
                .eq('content_id', alumId)
                .single();
            if (fetchErrors || !existingContent) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Content not found',
                });
            }

            const { error: deleteError } = await supabase
                .from('event_interests')
                .delete()
                .match({ alum_id: alumId, content_id: contentId });

            if (deleteError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: deleteError.message
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: `Alumnus ${eventId} and Content ${contentId} has been successfully deleted.`
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

export default deleteEventInterestsRouter;