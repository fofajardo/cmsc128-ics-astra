import express from 'express';
import httpStatus from 'http-status-codes';

const postJobsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {

            // required fields
            const requiredFields = [
                // required for contents
                "title",
                "details",
                "user_id",
                // required for jobs
                "job_title",
                "company_name",
                "salary",
                "apply_link"
            ];
            
            const missingFields = requiredFields.filter(field => !req.body[field]);
            
            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }
            
            // get data from req body
            const {
                title,
                details,
                user_id,
                job_title,
                company_name,
                hiring_manager,
                salary,
                apply_link
            } = req.body;

            // check if salary is valid
            if (typeof salary != "number" || salary <= 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid salary'
                });
            }

            // Check if userId valid
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(user_id)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid user_id format'
                });
            }
            
            // TODO: Implement transaction and rollbacl for better error handling 
            // since there are 2 queries in one API call

            // insert data to contents
            let { data, error } = await supabase
            .from('contents')
                .insert({
                    title: title,
                    details: details,
                    user_id: user_id,
                }).select();

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }
            
            const job_id = data[0].id;

            // insert data to jobs
            ({ data, error } = await supabase
                .from('jobs')
                .insert({
                    job_id: job_id,
                    job_title: job_title,
                    company_name: company_name,
                    hiring_manager: hiring_manager,
                    access_link: access_link,
                    salary: salary,
                    apply_link: apply_link
                }));

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Job posting successfully created',
                id: job_id,
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: 'Internal Server Error'
            });
        }
    });

    return router;
};

export default postJobsRouter;