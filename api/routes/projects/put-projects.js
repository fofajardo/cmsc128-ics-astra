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

const putProjectsRouter = (supabase) => {
    const router = express.Router();

    router.put('/:projectId', async (req, res) => {
        try {
            const { projectId } = req.params;

            // Check if projectId exists in the request params
            if (!projectId) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Missing projectId in params',
                });
            }

            // Validate if projectId is a valid UUID
            if (!isValidUUID(projectId)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid projectId format',
                });
            }

            // Check if the project exists in the database
            const { data: existingProject, error: fetchError } = await supabase
                .from('projects')
                .select()
                .eq('project_id', projectId)
                .single();

            // If project does not exist, return NOT_FOUND
            if (fetchError || !existingProject) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Project not found',
                });
            }

            // Validate request body
            const allowedFields = ['status', 'due_date', 'date_completed', 'goal_amount', 'donation_link'];

            allowedFields.forEach(field => {
                if (!(field in req.body)) {
                    return;
                }; // skip if field is not present

                const value = req.body[field];

                if ((field === 'status' && (typeof value !== 'number' || ![0, 1, 2].includes(value))) ||
                    (field === 'due_date' && !isValidDate(value)) ||
                    (field === 'date_completed' && (value !== null && !isValidDate(value))) ||
                    (field === 'goal_amount' && typeof value !== 'number') ||
                    (field === 'donation_link' && typeof value !== 'string')
                ) {
                    return res.status(400).json({
                        status: 'FAILED',
                        message: 'Invalid field values',
                        id: null
                    });
                }
            })

            // Loop through allowed fields and add them to the updateData object if present
            const updateData = {};
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                }
            })

            // Ensure that at least one valid field is provided for update
            if (Object.keys(updateData).length === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'No valid fields provided for update',
                });
            }

            // Update project in the database
            const { data, error } = await supabase
                .from('projects')
                .update(updateData)
                .eq('project_id', projectId)
                .select()
                .single();

            // Handle error during database update
            if (error) {
                // console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: error.message,
                });
            }

            // Return success response with updated project
            return res.status(httpStatus.OK).json({
                status: 'UPDATED',
                message: 'Project updated successfully',
            });

        } catch (error) {
            // Catch any other unexpected errors
            // console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }
    });

    return router;
};

export default putProjectsRouter;