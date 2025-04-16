import express from 'express';
import httpStatus from 'http-status-codes';

// Function to validate UUID format
const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

const deleteDonationsRouter = (supabase) => {
    const router = express.Router();

    router.delete('/:donationId', async (req, res) => {
        try {
            const { donationId } = req.params;

            // Check if donationId exists in the request params
            if (!donationId) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Missing donationId in params',
                });
            }

            // Validate if donationId is a valid UUID
            if (!isValidUUID(donationId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid donationId format',
                });
            }

            // Check if the donation exists in the database
            const { data: existingDonation, error: fetchError } = await supabase
                .from('donations')
                .select()
                .eq('id', donationId)
                .single();

            // If donation does not exist, return NOT_FOUND
            if (fetchError || !existingDonation) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Donation not found',
                });
            }

            // Delete donation in the database
            const response = await supabase
                .from('donations')
                .delete()
                .eq('id', donationId);

            // Handle error during database update
            if (response.error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: `${response.error}`,
                });
            }

            // Return success response with updated donation
            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: 'Donation deleted successfully',
            });

        } catch (error) {
            // Catch any other unexpected errors
            // console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: `${error}`,
            });
        }
    });

    return router;
};

export default deleteDonationsRouter;