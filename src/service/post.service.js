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

    const post = await prisma.posts.create({
      data: {
        title: data.title,
        content: data.content,
        caption: data.caption,
        image: data.image,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return {
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        caption: post.caption,
        image: post.image,
        author: post.userId,
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

    const posts = await prisma.posts.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      where: data.userId ? { authorId: data.userId } : undefined,
    });

    return {
      data: posts,
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
      where: {
        id: id,
      },
    });

    if (!post) {
      return { error: "Post not found." };
    }

    return {
      data: post,
    };
  } catch (error) {
    return { error: error.message };
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
