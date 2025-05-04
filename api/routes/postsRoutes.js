import express from "express";
import postsController from "../controllers/postsController.js";

const postsRouter = () => {
  const router = express.Router();

  router.get("/", postsController.getPosts);
  router.get("/:postId", postsController.getPostById);
  router.post("/", postsController.createPost);
  router.put("/:postId", postsController.updatePost);
  router.delete("/:postId", postsController.deletePost);

  return router;
}

export default postsRouter;