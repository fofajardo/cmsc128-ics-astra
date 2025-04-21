import httpStatus from "http-status-codes";
import contentsService from "../services/contentsService.js";

const getContents = (supabase) => async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { data, error } = await contentsService.fetchContents(supabase, page, limit);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: "OK",
            list: data || [],
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message
        });
    }
};

const getContentById = (supabase) => async (req, res) => {
    try {
        const { contentId } = req.params;

        const { data, error } = await contentsService.fetchContentById(supabase, contentId);

        if (error || !data) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "FAILED",
                message: "Content not found"
            });
        }

        return res.status(httpStatus.OK).json({
            status: "OK",
            content: data
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message
        });
    }
};

const createContent = (supabase) => async (req, res) => {
    try {
        const allowedFields = ["id", "user_id", "title", "details", "views", "created_at", "updated_at", "views", "tags"];
        const providedFields = Object.keys(req.body);

        // Check for unexpected fields
        const unexpectedFields = providedFields.filter((field) => !allowedFields.includes(field));
        if (unexpectedFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: `Unexpected fields: ${unexpectedFields.join(", ")}`,
            });
        }
        
        const requiredFields = [
            "id",
            "user_id",
            "title",
            "details",
            "views"
        ];

        const missingFields = requiredFields.filter(
            field => req.body[field] === undefined || req.body[field] === null
          );
          

        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const {
            id,
            user_id,
            title,
            details,
            created_at,
            updated_at,
            views
        } = req.body;

        // Validte user_id format
        const isValidUUID = /^[0-9a-fA-F-]{36}$/.test(user_id);
        if (!isValidUUID) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: "Invalid user_id format",
            });
        }

        const { data: existingContents, error: checkError } = await contentsService.checkExistingContent(supabase, title);

        if (checkError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: checkError
            });
        }

        if (existingContents?.length > 0) {
            return res.status(httpStatus.CONFLICT).json({
                status: 'FAILED',
                message: 'Content already exists'
            });
        }

        const { data, error } = await contentsService.insertContent(supabase, {
            id,
            user_id,
            title,
            details,
            created_at,
            updated_at,
            views,
        });

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message,
            });
        }

        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Content successfully created',
            content: {
                ...data,
                created_at: new Date(data.created_at).toISOString(),
                updated_at: new Date(data.updated_at).toISOString(),
                views: data.views
            }
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const updateContent = (supabase) => async (req, res) => {
    try {
        const contentId = req.params.contentId;

        // Validte contentId format
        const isValidUUID = /^[0-9a-fA-F-]{36}$/.test(contentId);
        if (!isValidUUID) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: "Invalid contentId format",
            });
        }

        const { data: existingContent, error: fetchError } = await contentsService.findContent(supabase, contentId);

        if (fetchError || !existingContent) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Content not found'
            });
        }

        const {
            user_id,
            title,
            details,
            created_at,
            updated_at,
        } = req.body;

        // Validate restricted fields
        if (user_id !== undefined) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Updating user_id is not allowed',
            });
        }


        if (title === '') {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Title cannot be empty',
            });
        }

        if (details === '') {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Details cannot be empty',
            });
        }

        const hasRestrictedFieldChanges =
        user_id !== undefined ||
        created_at !== undefined;

        if (hasRestrictedFieldChanges) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FORBIDDEN',
                message: 'Cannot update user ID and date created fields'
            });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (details !== undefined) updateData.details = details;

        if (Object.keys(updateData).length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'No valid fields to update'
            });
        }

        updateData.updated_at = new Date().toISOString();

        const { error: updateError } = await contentsService.updateContentData(supabase, contentId, updateData);

        if (updateError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: updateError.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: 'Content updated successfully'
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || 'An error occurred while updating the content'
        });
    }
};

const deleteContent = (supabase) => async (req, res) => {
    try {
        // console.log("req.params", req.params);
        const { contentId } = req.params;

        // Vlidate contentId format
        const isValidUUID = /^[0-9a-fA-F-]{36}$/.test(contentId);
        if (!isValidUUID) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: "Invalid contentId format",
            });
        }

        const { data, error: findError } = await contentsService.findContent(supabase, contentId);

        if (findError || !data) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: "FAILED", 
                message: "Content not found" 
            });
        }

        const { error: deleteError } = await contentsService.deleteContentData(supabase, contentId);

        if (deleteError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
                status: "FAILED", 
                message: deleteError.message 
            });
        }

        return res.status(httpStatus.OK).json({
            status: "DELETED",
            message: `Content with ID ${contentId} has been successfully deleted.`
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
            status: "FAILED", 
            message: error.message 
        });
    }
};

const contentsController = {
    getContents,
    getContentById,
    createContent,
    updateContent,
    deleteContent
};

export default contentsController;