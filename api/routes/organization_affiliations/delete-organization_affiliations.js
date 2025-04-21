import express from "express";
import httpStatus from "http-status-codes";

const deleteOrganizationAffiliationsRouter = (supabase) => {
    const router = express.Router();

    // DELETE /:orgId
    router.delete('/:alumId/organizations/:orgId', async (req, res) => {
        try {
            const { alumId } = req.params;
            const { orgId } = req.params;

                const { error } = await supabase
                    .from('organization_affiliations')
                    .delete()
                    .match({'org_id': orgId, 'alum_id': alumId});

                if (error) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 'FAILED',
                        message: error.message
                    });
                }
   
            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: `Affiliation has been deleted.`
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

export default deleteOrganizationAffiliationsRouter;