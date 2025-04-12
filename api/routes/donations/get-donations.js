import express from 'express';
import httpStatus from 'http-status-codes';

// Function to validate UUID format
const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

const getDonationsRouter = (supabase) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from('donations')
                .select()
                .range(startIndex, endIndex);

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: `${error}`
                });
            }

            // console.log(data);

            return res.status(httpStatus.OK).json({
                status: 'OK',
                donations: data || [],
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: `${error}`
            });
        }
    });

    router.get('/:donationId', async (req, res) => {
        try {
            const { donationId } = req.params;

            if (!isValidUUID(donationId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid donationId format'
                });
            }

            const response = await supabase
                .from('donations')
                .select(
                    'id, alum_id, project_id, donation_date, reference_num, mode_of_payment, amount'
                )
                .eq('id', donationId)
                .single();

            const { data, error } = response

            if (error) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: `Project not found ${error}`
                });
            }

            // console.log(data);

            return res.status(httpStatus.OK).json({
                status: 'OK',
                donation: data
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: `${error}`
            });
        }
    });

    return router;
};

export default getDonationsRouter;