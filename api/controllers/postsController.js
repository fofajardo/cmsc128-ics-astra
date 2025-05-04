import httpStatus from "http-status-codes";
import postsService from "../services/postsService.js";
import contentsService from "../services/contentsService.js";
import { isValidUUID } from "../utils/validators.js";
import { validateField } from "../utils/validators.js";
import contentsController from "./contentsController.js";

async function getPosts ( areq, ares ) {
  try {
    const filters = areq.query;

    const  { data, error } = await postsService.fetchPosts(areq.supabase, filters);

    if (error) {
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return ares.status(httpStatus.OK).json({
      status: "OK",
      list: data || []
    });
  } catch (error) {
    console.log(`Error fetching posts: ${error}`);
    return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

async function getPostById ( areq, ares ) {
  try {
    const { postId } = areq.params;

    if (!isValidUUID( postId )) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid post ID"
      });
    }

    const { data, error } = await postsService.fetchPostById(areq.supabase, postId);

    if ( error || !data ) {
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: "Job not found"
      });
    }

    return ares.status(httpStatus.OK).json({
      status: "OK",
      data: data
    });

  } catch (error) {
    console.log(`Error fetching post by ID: ${error}`);
    return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

async function createPost ( areq, ares ) {
  try {
    const allowedFields = [
      "title",
      "details",
      "tags",
      "category",
      "file", // TODO: IMPLEMENT FILE ATTACHMENT
      "user_id"
    ];

    const providedFields = Object.keys(areq.body);
    const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field));

    if (unexpectedFields.length > 0) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Unexpected fields: ${unexpectedFields.join(", ")}`
      });
    }

    const requiredFields = [
      "title",
      "details",
      "category",
      "user_id"
    ];

    const missingFields = requiredFields.filter(field => !areq.body[field]);

    if (missingFields.length > 0) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const {
      title,
      details,
      tags,
      category,
      file
    } = areq.body;

    if ( !validateField( title, "title" ) ) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid title"
      });
    }

    if ( !validateField( details, "details" ) ) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid details"
      });
    }

    if ( tags && !Array.isArray( tags ) ) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Tags must be an array"
      });
    }

    if ( category && !validateField( category, "category" ) ) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid category"
      });
    }

    if (!["newsletter", "announcement"].includes(category)) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid category"
      });
    }

    // check if post already exists
    const { data: existingPost, error: checkError } = await postsService.checkExistingPost(
      areq.supabase,
      title,
      details
    );

    if (checkError) {
      console.log(`Check existing post error: ${checkError}`);
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: checkError.message
      });
    }

    if (existingPost.length > 0) {
      console.log("Post already exists");
      return ares.status(httpStatus.CONFLICT).json({
        status: "FAILED",
        message: "Post already exists"
      });
    }

    // TODO: fetch user_id from active session
    const user_id = areq.body.user_id;

    // insert into contents first
    if (!user_id) {
      console.log("Missing user ID");
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Unauthorized: missing user ID"
      });
    }

    const { data: contentData, error: contentError } = await contentsService.insertContent(
      areq.supabase,
      {
        title,
        details,
        tags
      }
    );

    if (contentError) {
      console.log(`Insert content error: ${contentError}`);
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: contentError.message
      });
    }

    const contentId = contentData.id;

    // insert into posts
    const { data: postData, error: postError } = await postsService.insertPost(
      areq.supabase,
      {
        content_id: contentId,
        category,
        user_id,
        file
      }
    );

    if (postError) {
      console.log(`Insert post error: ${postError}`);
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: postError.message
      });
    }

    return ares.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Content and post created successfully",
      data: {
        post_id: postData.post_id,
        title,
        details
      }
    });
  } catch (error) {
    console.log(`Error creating post: ${error}`);
    return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

async function updatePost ( areq, ares ) {
  const postId = areq.params.postId;

  if (!isValidUUID(postId)) {
    return ares.status(httpStatus.BAD_REQUEST).json({
      status: "FAILED",
      message: "Invalid post ID"
    });
  }

  try {

    // Check if post exists
    const { data: existingPost, error: fetchError } = await postsService.fetchPostById(
      areq.supabase,
      postId
    );

    if (fetchError || !existingPost) {
      return ares.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Post not found"
      });
    }

    const {
      file
    } = areq.body;

    const allowedFields = [
      "file"
    ];

    if (!file) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Missing required fields"
      });
    }

    const providedFields = Object.keys(areq.body);
    const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field));

    if (unexpectedFields.length > 0) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Unexpected fields: ${unexpectedFields.join(", ")}`
      });
    }

    const updateData = {};

    if (file) {
      updateData.file = file;
    }

    if ( Object.keys(updateData).length === 0 ) {
      return ares.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "No fields to update"
      });
    }

    const { error: updateError } = await postsService.updatePostData(areq.supabase, postId, updateData);

    if (updateError) {
      console.log(`Error updating post: ${updateError}`);
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: updateError.message
      });
    }

    return ares.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Post updated successfully",
      data: updateData
    });

  } catch (error) {
    console.log(`Error updating post: ${error}`);
    return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while updating the post"
    });
  }
};

async function deletePost ( areq, ares ) {
  const postId = areq.params.postId;

  if (!isValidUUID(postId)) {
    return ares.status(httpStatus.BAD_REQUEST).json({
      status: "FAILED",
      message: "Invalid post ID"
    });
  }

  try {
    // Check if post exists
    const { data: existingPost, error: fetchError } = await postsService.fetchPostById(
      areq.supabase,
      postId
    );

    if (fetchError || !existingPost) {
      return ares.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Post not found"
      });
    }

    // Delete the post
    const { error: deleteError } = await postsService.deletePostData(areq.supabase, postId);
    if (deleteError) {
      console.log(`Error deleting post: ${deleteError}`);
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: deleteError.message
      });
    }

    // Delete the associated content
    const contentId = existingPost.post_id;
    const { error: deleteContentError } = await contentsService.deleteContentData(
      areq.supabase,
      contentId
    );
    if (deleteContentError) {
      console.log(`Error deleting content: ${deleteContentError}`);
      return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: deleteContentError.message
      });
    }

    return ares.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Post and content with ID ${existingPost.post_id} deleted successfully`
    });
  } catch (error) {
    console.log(`Error fetching post: ${error}`);
    return ares.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const postsController = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};

export default postsController;