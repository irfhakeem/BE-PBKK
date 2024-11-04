import {
  CreatePost,
  GetPosts,
  GetPostById,
  DeletePost,
} from "../service/post.service.js";

const _CreatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const userUsername = req.userUsername;
    const post = await CreatePost(req.body, userId, userUsername);
    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(201).json({
      status: "success",
      message: "Post created successfully.",
      data: post.data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

const _GetPosts = async (req, res) => {
  try {
    const posts = await GetPosts(req.body);
    if (posts.error) {
      return res.status(400).json({ message: posts.error });
    }

    res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully.",
      data: posts.data,
      pagination: posts.pagination,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

const _GetPostById = async (req, res) => {
  try {
    const post = await GetPostById(req.params.id);
    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(200).json({
      status: "success",
      message: "Post retrieved successfully.",
      data: post.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

const _DeletePost = async (req, res) => {
  try {
    const post = await DeletePost(req.params.id);
    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully.",
      data: post.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

export default {
  _CreatePost,
  _GetPosts,
  _GetPostById,
  _DeletePost,
};
