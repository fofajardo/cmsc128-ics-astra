import express from 'express';
import httpStatus from 'http-status-codes';

const postOrganizationsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            // Check required fields
            const requiredFields = [
                "name",
                "acronym",
                // "type",
                "founded_date"
            ];

            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }

            const {
                name,
                acronym,
                type,
                founded_date
            } = req.body;

            // Check if organization ID exists
            const { data: existingOrgs, error: checkError } = await supabase
            .from('organizations')
            .select('id')
            .or(`name.eq.${encodeURIComponent(name)},acronym.eq.${encodeURIComponent(acronym)}`);        


            if (checkError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: checkError
                });
            }

            if (existingOrgs.length > 0) {
                return res.status(httpStatus.CONFLICT).json({
                    status: 'FAILED',
                    message: 'Organization already exists'
                });
            }
 
            // Insert new user
            const { data, error } = await supabase
                .from('organizations')
                .insert({
                    name: name,
                    acronym: acronym,
                    type: parseInt(type) || 0, // Default to null if not provided
                    founded_date: founded_date
                })
                .select('id') // Select to return the ID

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Organization successfully created',
                id: data[0].id
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

export default postOrganizationsRouter;