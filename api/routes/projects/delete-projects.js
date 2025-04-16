import express from 'express';
import httpStatus from 'http-status-codes';

// Function to validate UUID format
const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

const deleteProjectsRouter = (supabase) => {
    const router = express.Router();

    router.delete('/:projectId', async (req, res) => {
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

            // Delete project in the database
            const response = await supabase
                .from('projects')
                .delete()
                .eq('project_id', projectId);

            // Handle error during database update
            if (response.error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: `${response.error}`,
                });
            }

            // Return success response with updated project
            return res.status(httpStatus.OK).json({
                status: 'DELETED',
                message: 'Project deleted successfully',
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

export default deleteProjectsRouter;