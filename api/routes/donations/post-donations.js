import express from 'express';
import httpStatus from 'http-status-codes';

// Function to validate UUID format
const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

// Function to validate Date format
const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

const postDonationsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            // Validate request body format and required fields
            const requiredFields = [
                'alum_id',
                'project_id',
                'donation_date',
                'reference_num',
                'mode_of_payment',
                'amount'
            ];

            const missingFields = requiredFields.filter(field =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                (typeof req.body[field] === 'string' && req.body[field].trim() === '')
            );

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                    id: null
                });
            }

            const {
                alum_id,
                project_id,
                donation_date,
                reference_num,
                mode_of_payment,
                amount
            } = req.body;

            const alumId = alum_id;
            const projectId = project_id;
            const donationDate = donation_date;
            const referenceNum = reference_num;
            const modeOfPayment = mode_of_payment;

            // Validate data types
            if (!isValidUUID(alumId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid alumId format',
                    id: null
                });
            }

            if (!isValidUUID(projectId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid projectId format',
                    id: null
                });
            }

            if ((typeof modeOfPayment !== 'number' || ![0, 1].includes(modeOfPayment)) ||
                !isValidDate(donationDate) ||
                typeof amount !== 'number' ||
                typeof referenceNum !== 'string'
            ) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid field values',
                    id: null
                });
            }

            // Check if alumId and projectId exists
            const alumIdResponse = await supabase
                .from('alumni_profiles')
                .select('alum_id')
                .eq('alum_id', alumId)
                .single();

            if (!alumIdResponse.data && alumIdResponse.error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: alumIdResponse.error.message,
                    id: null
                });
            }

            const projectIdResponse = await supabase
                .from('projects')
                .select('project_id')
                .eq('project_id', projectId)
                .single();

            if (!projectIdResponse.data && projectIdResponse.error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: projectIdResponse.error.message,
                    id: null
                });
            }

            // Insert data into the database
            const { data, error } = await supabase
                .from('donations')
                .insert({
                    alum_id: alumId,
                    project_id: projectId,
                    donation_date: donationDate,
                    reference_num: referenceNum,
                    mode_of_payment: modeOfPayment,
                    amount: amount
                })
                .select('id')
                .single();

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: `${error}`,
                    id: null
                });
            }

            // Return appropriate response on successsful creation
            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Donation successfully created',
                id: data['id']
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: `${error}`,
                id: null
            });
        }
    });

    return router;
};

export default postDonationsRouter;