import express from "express";
import httpStatus from "http-status-codes";

const deleteOrganizationsRouter = (supabase) => {
    const router = express.Router();

    // DELETE /:id
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

                const { error } = await supabase
                    .from('organizations')
                    .delete()
                    .eq('id', id);

                if (error) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 'FAILED',
                        message: error.message
                    });
                }
   
            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: `Organization with id: ${id} has been  deleted.`
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

export default deleteOrganizationsRouter;