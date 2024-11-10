import {
  CreatePost,
  GetPosts,
  GetPostById,
  DeletePost,
  LikePost,
  UnlikePost,
  IsPostLiked,
  CommentPost,
  DeleteComment,
  GetComments,
} from "../service/post.service.js";

const _CreatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const post = await CreatePost(req.body, userId);
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

const _LikePost = async (req, res) => {
  try {
    const post = await LikePost(req.body, req.userId);
    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(200).json({
      status: "success",
      message: "Post liked successfully.",
      data: post.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
};

const _UnlikePost = async (req, res) => {
  try {
    const result = await UnlikePost(req.body, req.userId);
    console.log(result);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(204).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error unliking post", error });
  }
};

const _IsPostLiked = async (req, res) => {
  try {
    const post = await IsPostLiked(req.body, req.userId);

    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(200).json({
      status: "success",
      message: "Post like status retrieved successfully.",
      data: post.data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving like status", error });
  }
};

const _CommentPost = async (req, res) => {
  try {
    const post = await CommentPost(req.body, req.userId);
    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(200).json({
      status: "success",
      message: "Post commented successfully.",
      data: post.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error commenting on post", error });
  }
};

const _DeleteComment = async (req, res) => {
  try {
    const post = await DeleteComment(req.body, req.userId);
    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(204).json({
      status: "success",
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

const _GetComments = async (req, res) => {
  try {
    const post = await GetComments(req.body);
    if (post.error) {
      return res.status(400).json({ message: post.error });
    }

    res.status(200).json({
      status: "success",
      message: "Comments retrieved successfully.",
      data: post.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export default {
  _CreatePost,
  _GetPosts,
  _GetPostById,
  _DeletePost,
  _LikePost,
  _UnlikePost,
  _IsPostLiked,
  _CommentPost,
  _DeleteComment,
  _GetComments,
};
