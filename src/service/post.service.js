import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CreatePost = async (data, userId) => {
  try {
    if (
      data.title === "" ||
      data.content === "" ||
      data.caption === "" ||
      data.image === ""
    ) {
      return { error: "All data are required!" };
    }

    const newPost = await prisma.posts.create({
      data: {
        title: data.title,
        content: data.content,
        caption: data.caption,
        image: data.thumbnail,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });

    for (const tagId of data.tags) {
      await prisma.postsOnTags.create({
        data: {
          postId: newPost.id,
          tagId: tagId,
        },
      });
    }

    const tags = await prisma.postsOnTags.findMany({
      where: {
        postId: newPost.id,
      },
      select: {
        tag: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      data: {
        ...newPost,
        tags: tags.map((tag) => tag.tag.name),
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const GetPosts = async (data) => {
  try {
    const limit = data.limit;
    const skip = Math.floor((data.round - 1) * limit);

    const totalPosts = await prisma.posts.count({
      where: data.userId ? { authorId: data.userId } : undefined,
    });

    const totalRound = Math.ceil(totalPosts / limit);

    if (data.round > totalRound) {
      return {
        data: [],
        pagination: {
          total: totalPosts,
          round: data.round,
          limit: limit,
          totalRound: totalRound,
        },
      };
    }

    // Fetch posts with like counts
    const posts = await prisma.posts.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      where: data.userId ? { authorId: data.userId } : undefined,
      include: {
        author: {
          select: {
            username: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    // Map posts to include likeCount property
    const postsWithLikes = posts.map((post) => ({
      ...post,
      authorUsername: post.author.username,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    }));

    return {
      data: postsWithLikes,
      pagination: {
        total: totalPosts,
        round: data.round,
        limit: limit,
        totalRound: totalRound,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { error: "An error occurred while fetching posts." };
  }
};

export const GetPostById = async (id) => {
  try {
    const post = await prisma.posts.findUnique({
      where: { id: id },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!post) {
      return { error: "Post not found." };
    }

    return {
      data: {
        ...post,
        authorUsername: post.author.username,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      },
    };
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return { error: "An error occurred while fetching the post." };
  }
};

export const DeletePost = async (id) => {
  try {
    const res = await prisma.posts.delete({
      where: {
        id: id,
      },
    });

    if (!res) {
      return { error: "Post not found." };
    }

    return {
      data: "Post deleted successfully.",
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const LikePost = async (data, userId) => {
  try {
    const res = await prisma.likes.create({
      data: {
        postId: data.postId,
        userId: userId,
      },
    });

    if (!res) {
      return { error: "Error liking post." };
    }

    return {
      data: {
        postId: res.postId,
        userId: res.userId,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const UnlikePost = async (data, userId) => {
  try {
    await prisma.likes.delete({
      where: {
        userId_postId: {
          postId: data.postId,
          userId: userId,
        },
      },
    });
    return { message: "Success unliking post." };
  } catch (error) {
    console.error("Error in UnlikePost:", error);
    return { error: "Failed to unlike post." };
  }
};

export const IsPostLiked = async (data, userId) => {
  try {
    const like = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          postId: data.postId,
          userId: userId,
        },
      },
    });
    return {
      data: like ? true : false,
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const CommentPost = async (data, userId) => {
  try {
    const comment = await prisma.comments.create({
      data: {
        postId: data.postId,
        userId: userId,
        content: data.content,
      },
    });

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    });

    return {
      data: {
        ...comment,
        user: {
          name: user.name,
        },
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const GetComments = async (data) => {
  try {
    const comments = await prisma.comments.findMany({
      where: {
        postId: data.postId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedComments = comments.map((comment) => ({
      ...comment,
      name: comment.user.name,
    }));

    return {
      data: formattedComments,
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const DeleteComment = async (data, userId) => {
  try {
    await prisma.comments.delete({
      where: {
        id: data.commentId,
        userId: userId,
      },
    });

    return {
      data: "Comment deleted successfully.",
    };
  } catch (error) {
    return { error: error.message };
  }
};
