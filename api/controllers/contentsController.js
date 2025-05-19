import httpStatus from "http-status-codes";
import contentsService from "../services/contentsService.js";

const getContents = async (req, res) => {
  try {
    const filters = req.query;

    const { data, count, error } = await contentsService.fetchContents(req.supabase, filters);

    if (error) {
      console.log(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data || [],
      total: count || 0,
      page: parseInt(filters.page) || 1,
      limit: parseInt(filters.limit) || 10
    });

  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const filters = req.query;

    const { data, error } = await contentsService.fetchContents(req.supabase);

    if (error) {
      console.log(error);
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
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getContentById = async (req, res) => {
  try {
    const { contentId } = req.params;

    const { data, error } = await contentsService.fetchContentById(req.supabase, contentId);

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

const createContent = async (req, res) => {
  try {
    const {
      user_id,
      title,
      details,
      views = 0,
      tags = []
    } = req.body;

    // Skip duplicate check for newsletters
    if (!tags.includes("newsletter")) {
      const { data: existingContent, error: checkError } = await contentsService.checkExistingContent(req.supabase, title);
      
      if (existingContent) {
        return res.status(httpStatus.CONFLICT).json({
          status: "FAILED",
          message: "A content with this title already exists"
        });
      }
    }

    const { data, error } = await contentsService.insertContent(req.supabase, {
      user_id,
      title,
      details,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views,
      tags,
    });

    if (error) {
      console.error("Create Content Error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Content successfully created",
      content: data
    });

  } catch (error) {
    console.error("Create Content Error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const updateContent = async (req, res) => {
  try {
    const contentId = req.params.contentId;

    // Validate contentId format
    const isValidUUID = /^[0-9a-fA-F-]{36}$/.test(contentId);
    if (!isValidUUID) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid contentId format",
      });
    }

    const { data: existingContent, error: fetchError } = await contentsService.findContent(req.supabase, contentId);

    if (fetchError || !existingContent) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Content not found"
      });
    }

    const {
      user_id,
      title,
      details,
      created_at,
      updated_at,
      tags
    } = req.body;

    // Validate restricted fields
    if (user_id !== undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Updating user_id is not allowed",
      });
    }


    const hasRestrictedFieldChanges =
        user_id !== undefined ||
        created_at !== undefined;

    if (hasRestrictedFieldChanges) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "Cannot update user ID and date created fields"
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (details !== undefined) updateData.details = details;
    if (tags !== undefined) updateData.tags = tags; // Add tags field to update

    if (Object.keys(updateData).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "No valid fields to update"
      });
    }

    updateData.updated_at = new Date().toISOString();

    const { error: updateError } = await contentsService.updateContentData(req.supabase, contentId, updateData);

    if (updateError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: updateError.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Content updated successfully"
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while updating the content"
    });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    // Validate contentId format
    const isValidUUID = /^[0-9a-fA-F-]{36}$/.test(contentId);
    if (!isValidUUID) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid contentId format",
      });
    }

    const { data, error: findError } = await contentsService.findContent(req.supabase, contentId);

    if (findError || !data) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Content not found"
      });
    }

    const { error: deleteError } = await contentsService.deleteContentData(req.supabase, contentId);

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
  getAnnouncements,
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent
};

export default contentsController;
