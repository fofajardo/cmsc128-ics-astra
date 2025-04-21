import express from 'express';
import httpStatus from 'http-status-codes';

// @req body: 
// {   
//     org_id
//     role
//     joined_date
// }
const postOrganizationAffiliationsRouter = (supabase) => {
    const router = express.Router();

    router.post('/:alumId/organizations', async (req, res) => {
        try {

            const { alumId } = req.params;

            // Check required fields
            const requiredFields = [
                "org_id",
                "role",
                "joined_date"
            ];

            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }

            const {
                org_id,
                role,
                joined_date,
            } = req.body;

            // Check if affiliation already exists
            const { data: existingAffiliations, error: checkError } = await supabase
            .from('organization_affiliations')
            .select()
            .match({ org_id: org_id, alum_id: alumId });     

            if (checkError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: checkError
                });
            }

            if (existingAffiliations.length > 0) {
                return res.status(httpStatus.CONFLICT).json({
                    status: 'FAILED',
                    message: 'Alum is already affiliated with this organization'
                });
            }
 
            // Insert new user
            const { data, error } = await supabase
                .from('organization_affiliations')
                .insert({
                    org_id: org_id,
                    alum_id: alumId,
                    role: role,
                    joined_date: joined_date,
                })

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Affiliation successfully created',
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message || error
            });
        }
    });

    return router;
};

export default postOrganizationAffiliationsRouter;