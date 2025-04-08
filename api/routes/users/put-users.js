import express from 'express';
import httpStatus from 'http-status-codes';

// TODO: no CASL auth yet
const putUsersRouter = (supabase) => {
    const router = express.Router();

    router.put('/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            // Check if userId exists (simplified for test compatibility)
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (fetchError || !existingUser) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'User not found'
                });
            }

            // Extract fields from request body
            const {
                username,
                email,
                password,
                firstName,
                middleName,
                lastName,
                role
            } = req.body;

            // Check if restricted fields are being updated
            const hasRestrictedFieldChanges = 
                firstName !== undefined || 
                middleName !== undefined || 
                lastName !== undefined || 
                role !== undefined;
            
            // basing on test, regular users can't update these fields at all
            if (hasRestrictedFieldChanges) {
                return res.status(httpStatus.FORBIDDEN).json({
                    status: 'FORBIDDEN',
                    message: 'Cannot update name and role fields'
                });
            }
            
            // Build update object with only provided fields
            const updateData = {};
            if (username !== undefined) updateData.username = username;
            if (email !== undefined) updateData.email = email;
            if (password !== undefined) updateData.password = password;
            
            // If no fields to update, return early
            if (Object.keys(updateData).length === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'No valid fields to update'
                });
            }
            
            // Always update the updatedAt field
            updateData.updatedAt = new Date().toISOString();

            // Update user in database
            const { error: updateError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', userId);

            if (updateError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: updateError.message
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'UPDATED',
                message: 'User profile updated successfully'
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message || 'An error occurred while updating the user'
            });
        }
    });

    return router;
};

export default putUsersRouter;