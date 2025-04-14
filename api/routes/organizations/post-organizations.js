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
                "type",
                "founded_at"
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
                founded_at
            } = req.body;

            // Check if organization ID exists
            const { data: existingUsers, error: checkError } = await supabase
                .from('organizations')
                .select('*')
                .or(`name.eq.${name}, founded_at.eq.${founded_at}`);

            if (checkError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: checkError
                });
            }

            if (existingUsers.length > 0) {
                return res.status(httpStatus.CONFLICT).json({
                    status: 'FAILED',
                    message: 'Organization already exists'
                });
            }

            // Insert new user
            const { data, error } = await supabase
                .from('organizations')
                .insert({
                    name,
                    acronym,
                    type,
                    founded_at
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