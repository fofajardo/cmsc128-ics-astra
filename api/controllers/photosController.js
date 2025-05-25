import httpStatus from "http-status-codes";
import photosService from "../services/photosService.js";
import contentsService from "../services/contentsService.js";
import fs from "fs";
import path from "path";
import { get } from "http";
import { create } from "domain";

const getAllPhotos = async (req, res) => {
  try {
    const { data, error } = await photosService.fetchAllPhotos(req.supabase);

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

const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await photosService.fetchPhotoById(req.supabase, id);

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

const getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await photosService.fetchFileById(req.supabase, id);

    if (error || !data) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "File not found",
      });
    }

    // Generate signed URL for the file
    const { data: signedUrlData, error: signedUrlError } = await req.supabase
      .storage
      .from("user-photos-bucket")
      .createSignedUrl(data.image_key, 60 * 60); // URL valid for 1 hour

    if (signedUrlError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: "Failed to generate file URL",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      file: {
        ...data,
        url: signedUrlData.signedUrl
      },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    const { user_id, content_id, type } = req.body;
    const file = req.file;

    console.log("File upload details:", {
      file: file,
      user_id: user_id,
      content_id: content_id,
      type: type
    });

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

    const { data: storageData, error: storageError } = await req.supabase.storage
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

    const { data, error } = await photosService.insertPhoto(req.supabase, photoData);

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

const getFiles = async (req, res) => {
  try {
    const { data, error } = await photosService.fetchAllFiles(req.supabase);

    console.log("Files:", data);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      files: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const uploadNewsletter = async (req, res) => {
  try {
    const { title, user_id, content_id } = req.body;
    const file = req.file;

    console.log("Newsletter upload details:", {
      title: title,
      file: file
    });

    if (!file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "File is required",
      });
    }

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    const oldPath = path.join(file.destination, file.filename);

    // Read the file content
    const fileContent = fs.readFileSync(oldPath);

    const { data: storageData, error: storageError } = await req.supabase.storage
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

    const { data, error } = await photosService.insertFile(req.supabase, {
      user_id: user_id || null,
      content_id: content_id || null,
      title: title || null,
      type: req.body.type || 6, // Default to newsletter type (6)
      image_key: storageData.path, // Save the new unique file path
    });

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "File uploaded successfully",
      file: data[0],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, content_id, type, file } = req.body;

    console.log("Photo update details:", {
      id: id,
      user_id: user_id,
      content_id: content_id,
      type: type,
      file: file ? "File provided" : "No file"
    });

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

      // Upload directly from buffer
      const { data: storageData, error: storageError } = await req.supabase.storage
        .from("user-photos-bucket")
        .upload(uniqueFilename, file.buffer, {
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

    const { data, error } = await photosService.updatePhotoById(req.supabase, id, updates);

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

const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Photo ID is required",
      });
    }

    // Fetch the photo details to get the file path (image_key)
    const { data: photo, error: fetchError } = await photosService.fetchPhotoById(req.supabase, id);

    console.log("Fetched photo:", photo);
    console.log("Fetch error:", fetchError);

    if (fetchError || !photo) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Photo not found",
      });
    }

    // Delete the file from Supabase storage
    const { error: storageError } = await req.supabase.storage
      .from("user-photos-bucket")
      .remove([photo.image_key]);

    if (storageError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: `Failed to delete file from Supabase storage: ${storageError.message}`,
      });
    }

    // Delete the photo record from the database
    const { error: deleteError } = await photosService.deletePhotoById(req.supabase, id);

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

const deleteAvatar = async function(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "User ID is required",
      });
    }

    // Fetch the photo details to get the file path (image_key)
    const { error } = await photosService.deleteAvatar(req.supabase, id);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }

  return res.status(httpStatus.OK).json({
    status: "DELETED",
  });
};

const uploadOrReplaceAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;

    // Validate inputs
    if (!file || !userId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "File and userId are required",
      });
    }

    // Read the file content
    const fileContent = fs.readFileSync(path.join(file.destination, file.filename));

    // Call the service function
    const { data, error } = await photosService.uploadOrReplaceAvatar(
      req.supabase,
      userId,
      fileContent,
      file.mimetype
    );

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message || "Failed to upload avatar",
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "SUCCESS",
      message: "Avatar uploaded successfully",
      photo: data[0],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An unexpected error occurred",
    });
  }
};

const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Newsletter ID is required",
      });
    }

    // First fetch the newsletter details to get the image_key
    const { data: newsletter, error: fetchError } = await photosService.fetchFileById(req.supabase, id);

    if (fetchError || !newsletter) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Newsletter not found",
      });
    }

    // Delete the file from Supabase storage
    const { error: storageError } = await req.supabase.storage
      .from("user-photos-bucket")
      .remove([newsletter.image_key]);

    if (storageError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: `Failed to delete file from Supabase storage: ${storageError.message}`,
      });
    }

    // Now delete the database records
    const { data, error } = await photosService.deleteNewsletterById(req.supabase, id);
    const { data: content, error: contentError } = await contentsService.deleteContentData(req.supabase, id);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    if (contentError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: contentError.message,
      });
    }
    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getAllProfilePics = async (req, res) => {
  try {
    const { data, error } = await photosService.fetchAllProfilePics(req.supabase);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "No profile pictures found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      profilePics: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getPhotoByAlumId = async (req, res) => {
  try {
    const { alum_id } = req.params;
    // console.log("Alum ID:", alum_id);

    // Fetch the photo record from the database
    const { data, error } = await photosService.fetchPhotoIdbyAlum(req.supabase, alum_id);

    if (error || !data) {
      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: "https://cdn-icons-png.flaticon.com/512/145/145974.png"
      });
    }

    try {
      // Try both approaches - first signed URL, then public URL
      const { data: signedUrlData, error: signedUrlError } = await req.supabase
        .storage
        .from("user-photos-bucket")
        .createSignedUrl(data.image_key, 60 * 60);

      if (signedUrlError) {
        console.log("Will use public URL.");

        // Try public URL as fallback
        const { data: publicUrlData } = req.supabase
          .storage
          .from("user-photos-bucket")
          .getPublicUrl(data.image_key);

        if (publicUrlData && publicUrlData.publicUrl) {
          console.log("Public URL generated successfully.", publicUrlData.publicUrl);
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: publicUrlData.publicUrl
          });
        } else {
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: "https://cdn-icons-png.flaticon.com/512/145/145974.png"
          });
        }
      }

      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: signedUrlData.signedUrl,
      });
    } catch (urlError) {
      console.error("Error generating URL:", urlError);
      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: "https://cdn-icons-png.flaticon.com/512/145/145974.png"
      });
    }
  } catch (error) {
    console.error("Error in getPhotoByAlumId:", error);
    return res.status(httpStatus.OK).json({
      status: "OK",
      photo: "https://cdn-icons-png.flaticon.com/512/145/145974.png"
    });
  }
};

const getDegreeProofPhotoByAlumId = async (req, res) => {
  try {
    const { alum_id } = req.params;
    // console.log("Alum ID:", alum_id);

    // Fetch the photo record from the database
    const { data, error } = await photosService.fetchDegreeProofPhoto(req.supabase, alum_id);

    if (error || !data) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Photo not found for the given Alum ID",
      });
    }

    // Generate a signed URL for the photo
    const { data: signedUrlData, error: signedUrlError } = await req.supabase
      .storage
      .from("user-photos-bucket")
      .createSignedUrl(data, 60 * 60); // URL valid for 1 hour

    if (signedUrlError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: "Failed to generate signed URL",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      photo: signedUrlData.signedUrl,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getJsonOfDegreeProofPhotoByAlumId = async (req, res) => {
  try {
    const { alum_id } = req.params;
    // console.log("Alum ID:", alum_id);

    // Fetch the photo record from the database
    const { data, error } = await photosService.fetchDegreeProofPhoto(req.supabase, alum_id);

    if (error || !data) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Photo not found for the given Alum ID",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getEventPhotoByContentId = async (req, res) => {
  try {
    const { content_id } = req.params;
    console.log("Content ID:", content_id);
    console.log("Looking for photo with content_id:", content_id, "and type: 3");

    // Fetch the photo record from the database
    const { data, error } = await photosService.fetchEventPhotos(req.supabase, content_id);

    // console.log("Response data:", data);
    // console.log("Response error:", error);

    if (error || !data) {
      // console.log("Photo not found for content_id:", content_id, "Error:", error);
      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: "/events/default-event.jpg" // Default event image
      });
    }

    try {
      // Try both approaches - first signed URL, then public URL
      const { data: signedUrlData, error: signedUrlError } = await req.supabase
        .storage
        .from("user-photos-bucket")
        .createSignedUrl(data.image_key, 60 * 60);

      if (signedUrlError) {
        console.log("Will use public URL.");

        // Try public URL as fallback
        const { data: publicUrlData } = req.supabase
          .storage
          .from("user-photos-bucket")
          .getPublicUrl(data.image_key);

        if (publicUrlData && publicUrlData.publicUrl) {
          // console.log("Public URL generated successfully for event.", publicUrlData.publicUrl);
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: publicUrlData.publicUrl
          });
        } else {
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: "/events/default-event.jpg" // Default event image
          });
        }
      }

      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: signedUrlData.signedUrl,
      });
    } catch (urlError) {
      console.error("Error generating URL for event:", urlError);
      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: "/events/default-event.jpg" // Default event image
      });
    }
  } catch (error) {
    console.error("Error in getEventPhotoByContentId:", error);
    return res.status(httpStatus.OK).json({
      status: "OK",
      photo: "/events/default-event.jpg" // Default event image
    });
  }
};

const getProjectPhotoByContentId = async (req, res) => {
  try {
    const { project_id } = req.params;
    // console.log("Project ID:", project_id);
    // console.log("Looking for photo with content_id:", project_id, "and type: 5");

    // Fetch the photo record from the database
    const { data, error } = await photosService.fetchProjectPhotos(req.supabase, project_id);

    // console.log("Response data:", data);
    // console.log("Response error:", error);

    if (error || !data) {
      // console.log("Photo not found for project_id:", project_id, "Error:", error);
      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: "/projects/assets/Donation.jpg" // Default project image
      });
    }

    try {
      // Try both approaches - first signed URL, then public URL
      const { data: signedUrlData, error: signedUrlError } = await req.supabase
        .storage
        .from("user-photos-bucket")
        .createSignedUrl(data.image_key, 60 * 60);

      if (signedUrlError) {
        console.log("Will use public URL.");

        // Try public URL as fallback
        const { data: publicUrlData } = req.supabase
          .storage
          .from("user-photos-bucket")
          .getPublicUrl(data.image_key);

        if (publicUrlData && publicUrlData.publicUrl) {
          // console.log("Public URL generated successfully for project.", publicUrlData.publicUrl);
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: publicUrlData.publicUrl
          });
        } else {
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: "/projects/assets/Donation.jpg" // Default project image
          });
        }
      }

      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: signedUrlData.signedUrl,
      });
    } catch (urlError) {
      console.error("Error generating URL for project:", urlError);
      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: "/projects/assets/Donation.jpg" // Default project image
      });
    }
  } catch (error) {
    console.error("Error in getProjectPhotoByContentId:", error);
    return res.status(httpStatus.OK).json({
      status: "OK",
      photo: "/projects/assets/Donation.jpg" // Default project image
    });
  }
};

const getJobPhotoByContentId = async (req, res) => {
  try {
    const { job_id } = req.params;
    // console.log("Job ID:", job_id);
    // console.log("Looking for photo with content_id:", job_id, "and type: 4");

    // Fetch the photo record from the database
    const { data, error } = await photosService.fetchJobPhotos(req.supabase, job_id);

    if (error || !data) {
      // console.log("Photo not found for job_id:", job_id, "Error:", error);
      return res.status(200).json({
        status: "OK",
        photo: "/jobs/assets/default-job.jpg" // Default job image
      });
    }

    return res.status(200).json({
      status: "OK",
      photo: data.image_key,
    });
  } catch (error) {
    console.error("Error in getJobPhotoByContentId:", error);
    return res.status(200).json({
      status: "OK",
      photo: "/jobs/assets/default-job.jpg" // Default job image
    });
  }
};

const getContentPhotoTypes = async (req, res) => {
  try {
    const { content_ids } = req.query;

    if (!content_ids) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Content IDs are required"
      });
    }

    // Split the comma-separated IDs and create an array
    const contentIdArray = content_ids.split(",");

    const { data, error } = await photosService.fetchPhotoTypesByContentIds(req.supabase, contentIdArray);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      types: data
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getPhotosByContentId = async (req, res) => {
  try {
    const { contentId } = req.params;

    if (!contentId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Content ID is required"
      });
    }

    const { data, error } = await photosService.fetchPhotosByContentId(req.supabase, contentId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    // Process photos to include signed URLs
    let photosWithUrls = [];
    if (data && data.length > 0) {
      const urlPromises = data.map(async (photo) => {
        const { data: signedUrlData, error: signedUrlError } = await req.supabase
          .storage
          .from("user-photos-bucket")
          .createSignedUrl(photo.image_key, 60 * 60); // URL valid for 1 hour

        return {
          ...photo,
          url: signedUrlError ? null : signedUrlData.signedUrl
        };
      });

      photosWithUrls = await Promise.all(urlPromises);
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      photos: photosWithUrls || []
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getDonationReceipt = async (req, res) => {
  try {
    const { user_id, project_id } = req.query;

    if (!user_id || !project_id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Both user_id and project_id are required"
      });
    }

    // Fetch the receipt photo matching both user_id and project_id
    const { data, error } = await photosService.fetchDonationReceipt(req.supabase, user_id, project_id);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    // If no receipt photo found
    if (!data || data.length === 0) {
      return res.status(httpStatus.OK).json({
        status: "OK",
        message: "No receipt photo found for this donation",
        photo: null
      });
    }

    // Found receipt photo - generate a signed URL
    const receiptPhoto = data[0];

    try {
      const { data: signedUrlData, error: signedUrlError } = await req.supabase
        .storage
        .from("user-photos-bucket")
        .createSignedUrl(receiptPhoto.image_key, 60 * 60); // URL valid for 1 hour

      if (signedUrlError) {
        // Try public URL as fallback
        const { data: publicUrlData } = req.supabase
          .storage
          .from("user-photos-bucket")
          .getPublicUrl(receiptPhoto.image_key);

        if (publicUrlData && publicUrlData.publicUrl) {
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: receiptPhoto,
            url: publicUrlData.publicUrl
          });
        } else {
          return res.status(httpStatus.OK).json({
            status: "OK",
            photo: receiptPhoto,
            url: null,
            message: "Could not generate URL for receipt photo"
          });
        }
      }

      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: receiptPhoto,
        url: signedUrlData.signedUrl
      });
    } catch (urlError) {
      console.error("Error generating URL for receipt photo:", urlError);
      return res.status(httpStatus.OK).json({
        status: "OK",
        photo: receiptPhoto,
        url: null,
        message: "Error generating URL for receipt photo"
      });
    }
  } catch (error) {
    console.error("Error in getDonationReceipt:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const updateEventPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { content_id } = req.body;
    const file = req.file;

    console.log("Event Photo update details:", {
      id: id,
      content_id: content_id,
      file: file ? "File provided" : "No file"
    });

    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Photo ID is required",
      });
    }

    if (!file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "File is required for updating event photo",
      });
    }

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    const oldPath = path.join(file.destination, file.filename);

    // Read the file content
    const fileContent = fs.readFileSync(oldPath);

    // Upload the file to storage
    const { data: storageData, error: storageError } = await req.supabase.storage
      .from("user-photos-bucket")
      .upload(uniqueFilename, fileContent, {
        contentType: file.mimetype,
      });

    if (storageError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: `Failed to upload file to storage: ${storageError.message}`,
      });
    }

    // Update the photo record with the new image key
    const photoData = {
      image_key: storageData.path,
    };

    // Add content_id if provided
    if (content_id) {
      photoData.content_id = content_id;
    }

    // Fixed type for event photo
    photoData.type = 3; // Use PhotoType.EVENT_PIC in production

    // Update the photo in the database
    const { data, error } = await photosService.updatePhotoById(req.supabase, id, photoData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Event photo not found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Event photo updated successfully",
      photo: data[0],
    });
  } catch (error) {
    console.error("Error in updateEventPhoto:", error);
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
  getAllProfilePics,
  getPhotoByAlumId,
  getEventPhotoByContentId,
  getProjectPhotoByContentId,
  getDegreeProofPhotoByAlumId,
  getJsonOfDegreeProofPhotoByAlumId,
  getJobPhotoByContentId,
  getContentPhotoTypes,
  getPhotosByContentId,
  getDonationReceipt,
  uploadNewsletter,
  getFiles,
  getFileById,
  deleteNewsletter,
  deleteAvatar,
  uploadOrReplaceAvatar,
  updateEventPhoto,
};

export default photosController;