import express from 'express';
import httpStatus from 'http-status-codes';

const putOrganizationsRouter = (supabase) => {
    const router = express.Router();
    
    router.put('/:id', async (req, res) => {
        try {
            const id = req.params.id;

            // Check if id exists (simplified for test compatibility)
            const { data: existingOrgs, error: fetchError } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError || !existingOrgs) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Organization not found'
                });
            }

            // Extract fields from request body
            const {
                name,
                acronym,
                type,
                founded_date,
            } = req.body;

            
            // Build update object with only provided fields
            const updateData = {};
            if (name) updateData.name = name;
            if (acronym) updateData.acronym = acronym;
            if (type) updateData.type = parseInt(type) || 0; // Default to null if not provided
            if (founded_date) updateData.founded_date = founded_date;
            
            
            // If no fields to update, return early
            if (Object.keys(updateData).length === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'No valid fields to update'
                });
            }

            
            // Always update the updatedAt field; no updateAt field in organizations table
            // updateData.updated_at = new Date().toISOString();

            // Update user in database
            const { error: updateError } = await supabase
                .from('organizations')
                .update(updateData)
                .eq('id', id);

            if (updateError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: updateError.message
                });
            }

            return res.status(httpStatus.OK).json({
                status: 'UPDATED',
                message: 'Organization profile updated successfully'
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message || 'An error occurred while updating the organization'
            });
        }
    });

    return router;
};

export default putOrganizationsRouter;