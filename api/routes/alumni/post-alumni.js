import express from 'express';
import httpStatus from 'http-status-codes';

const postAlumniRouter = (supabase) => {
    const router = express.Router();

    router.post('/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            // Check if userId valid
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(userId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid userId format'
                });
            }

            // TODO Check if userId exists (GET /v1/users/:userId)

            // TODO check if alumni profile already exists (GET /v1/alumni/:userId)

            // check required fields
            const requiredFields = [
                "alum_id",
                "birthdate",
                // "location",
                // "address",
                "gender",
                "student_num",
                "degree_program",
                "year_graduated",
                // "skills",
                // "field",
                // "job_title",
                // "company",
                // "honorifics",
                // "citizenship"
            ];

            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }

            // insert data to supabase
            const {
                alum_id,
                birthdate,
                location,
                address,
                gender,
                student_num,
                degree_program,
                year_graduated,
                skills,
                field,
                job_title,
                company,
                citizenship
            } = req.body;

            const { data, error } = await supabase
                .from('alumni_profiles')
                .insert({
                    alum_id: alum_id,
                    birthdate: birthdate,
                    location: location,
                    address: address,
                    gender: gender,
                    student_num: student_num,
                    degree_program: degree_program,
                    year_graduated: year_graduated,
                    skills: skills,
                    field: field,
                    job_title: job_title,
                    company: company,
                    citizenship: citizenship,
                });

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Alumni profile successfully created',
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

export default postAlumniRouter;