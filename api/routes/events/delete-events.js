import express from "express";
import httpStatus from "http-status-codes";

const deleteEventsRouter = (supabase) => {
    const router = express.Router();

    router.delete('/:eventId', async (req, res) => {
        try {

            const {eventId}  = req.params;

            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(eventId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid eventId format'
                });
            }


            const { data: existingEvent, error: fetchError } = await supabase
                .from('events')
                .select()
                .eq('event_id', eventId)
                .single();
            if (fetchError || !existingEvent) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Event not found',
                });
            }

            const { error: deleteError } = await supabase
                .from('events')
                .delete()
                .eq('event_id', eventId);

            if (deleteError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: deleteError.message
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: `Event ${eventId} has been successfully deleted.`
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

export default deleteEventsRouter;