import httpStatus from "http-status-codes";
import photosService from "../services/photosService.js";
import fs from "fs";
import path from "path";

const getAllPhotos = (supabase) => async (req, res) => {
  try {
        const { data, error } = await photosService.fetchAllPhotos(supabase);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "FAILED",
                message: "No photos found",
            });
        }

        return res.status(httpStatus.OK).json({
            status: "OK",
            photos: data,
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

const getPhotoById = (supabase) => async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await photosService.fetchPhotoById(supabase, id);

    if (error || !data) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Photo not found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      photo: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const uploadPhoto = (supabase) => async (req, res) => {
    try {
        const { user_id, content_id, type } = req.body;
        const file = req.file;

        // Validate that at least one of user_id or content_id exists, and file is provided
        if (!file || (!user_id && !content_id) || type === undefined) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: "File and 'type' are required, and at least one of user_id or content_id must be provided",
            });
        }

        // Generate a unique filename
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        const oldPath = path.join(file.destination, file.filename);

        // Read the file content
        const fileContent = fs.readFileSync(oldPath);

        const { data: storageData, error: storageError } = await supabase.storage
        .from("user-photos-bucket")
        .upload(uniqueFilename, fileContent, {
            contentType: file.mimetype,
        });

        if (storageError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: `Failed to upload file to Supabase storage: ${storageError.message}`,
            });
        }

        // Save the file path and metadata to the database
        const photoData = {
            user_id: user_id || null,
            content_id: content_id || null,
            type, // Include the new 'type' column
            image_key: storageData.path, // Save the new unique file path
        };

        const { data, error } = await photosService.insertPhoto(supabase, photoData);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message,
            });
        }

        return res.status(httpStatus.CREATED).json({
            status: "CREATED",
            message: "Photo uploaded successfully",
            photo: data[0],
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

const updatePhoto = (supabase) => async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, content_id, type } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Photo ID is required",
      });
    }

    const updates = {};
    if (user_id) updates.user_id = user_id;
    if (content_id) updates.content_id = content_id;
    if (type !== undefined) updates.type = type; // Include the 'type' column
    if (file) {
        // Generate a unique filename for the new file
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        const oldPath = path.join(file.destination, file.filename);
        const fileContent = fs.readFileSync(oldPath);

        const { data: storageData, error: storageError } = await supabase.storage
            .from("user-photos-bucket")
            .upload(uniqueFilename, fileContent, {
                contentType: file.mimetype,
            });

        if (storageError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: `Failed to upload file to Supabase storage: ${storageError.message}`,
            });
        }

        updates.image_key = storageData.path; // Update the image key
    }

    const { data, error } = await photosService.updatePhotoById(supabase, id, updates);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Photo not found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Photo updated successfully",
      photo: data[0],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const deletePhoto = (supabase) => async (req, res) => {
    try {
        const { id } = req.params;
    
        if (!id) {
            return res.status(httpStatus.BAD_REQUEST).json({
            status: "FAILED",
            message: "Photo ID is required",
            });
        }
  
        // Fetch the photo details to get the file path (image_key)
        const { data: photo, error: fetchError } = await photosService.fetchPhotoById(supabase, id);
    
        if (fetchError || !photo) {
            return res.status(httpStatus.NOT_FOUND).json({
            status: "FAILED",
            message: "Photo not found",
            });
        }
  
        // Delete the file from Supabase storage
        const { error: storageError } = await supabase.storage
            .from("user-photos-bucket")
            .remove([photo.image_key]);
  
        if (storageError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: `Failed to delete file from Supabase storage: ${storageError.message}`,
            });
        }
  
        // Delete the photo record from the database
        const { error: deleteError } = await photosService.deletePhotoById(supabase, id);
    
        if (deleteError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: deleteError.message,
            });
        }
  
        return res.status(httpStatus.OK).json({
            status: "DELETED",
            message: "Photo deleted successfully",
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

const photosController = {
  getAllPhotos,
  getPhotoById,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
};

export default photosController;