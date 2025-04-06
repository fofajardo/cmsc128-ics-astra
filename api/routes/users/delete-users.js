import express from "express";
import httpStatus from "http-status-codes";

const deleteUsersRouter = (supabase) => {
    const router = express.Router();

    // DELETE /:userId?hard=true
    router.delete('/:userId', async (req, res) => {
        try {
            const { userId } = req.params;
            const hard = req.query.hard === 'true';

            if (hard) {
                const { error } = await supabase
                    .from('users')
                    .delete()
                    .eq('id', userId);

                if (error) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 'FAILED',
                        message: error.message
                    });
                }
            } else {
                const { error } = await supabase
                    .from('users')
                    .update({ deleted_at: new Date().toISOString() }) /* untested */
                    .eq('id', userId);

                if (error) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 'FAILED',
                        message: error.message
                    });
                }
            }

            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: `User ${userId} has been ${hard ? 'hard' : 'soft'} deleted.`
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

export default deleteUsersRouter;