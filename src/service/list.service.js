import { PrismaClient } from "@prisma/client";
import messages from "../helpers/messages/list.message.js";

const prisma = new PrismaClient();

export const getMyLists = async (userId) => {
  try {
    const lists = await prisma.lists.findMany({
      where: {
        userId: userId,
      },
    });

    if (!lists || lists.length === 0) {
      return { error: "No lists found for this user." };
    }

    return { data: lists };
  } catch (error) {
    return { error: error.message };
  }
};

export const getSpecificList = async (listId) => {
  try {
    const list = await prisma.lists.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return { error: messages.ErrListNotFound };
    }

    const posts = await prisma.posts.findMany({
      where: {
        lists: {
          some: {
            id: listId,
          },
        },
      },
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

    const formattedPosts = posts.map((post) => {
      return {
        ...post,
        authorUsername: post.author.username,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      };
    });

    return { data: { ...list, posts: formattedPosts } };
  } catch (error) {
    return { error: error.message };
  }
};

export const createList = async (userId, data) => {
  try {
    const list = await prisma.lists.create({
      data: {
        userId: userId,
        title: data.title,
      },
    });

    if (!list) {
      return { error: messages.ErrCreateList };
    }

    return { data: list };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteList = async (data) => {
  try {
    await prisma.lists.delete({
      where: {
        id: data.listId,
      },
    });

    return { message: messages.SuccessDeleteList };
  } catch (error) {
    return { error: error.message };
  }
};

export const getUserLists = async (data) => {
  try {
    const lists = await prisma.lists.findMany({
      where: {
        userId: data.userId,
      },
      include: {
        posts: {
          take: 3,
        },
      },
    });

    if (!lists || lists.length === 0) {
      return { error: "No lists found for this user." };
    }

    return { data: lists };
  } catch (error) {
    return { error: error.message };
  }
};

export const addPostToList = async (data) => {
  try {
    const list = await prisma.lists.update({
      where: {
        id: data.listId,
      },
      data: {
        posts: {
          connect: { id: data.postId },
        },
      },
    });

    if (!list) {
      return { error: "List not found" };
    }

    return { data: list };
  } catch (error) {
    return { error: error.message };
  }
};

export const removePostFromList = async (data) => {
  try {
    const list = await prisma.lists.update({
      where: {
        id: data.listId,
      },
      data: {
        posts: {
          disconnect: { id: data.postId },
        },
      },
    });

    if (!list) {
      return { error: "List not found" };
    }

    return { data: list };
  } catch (error) {
    return { error: error.message };
  }
};

export const isPostListed = async (userId, data) => {
  try {
    const listWithPost = await prisma.lists.findFirst({
      where: {
        userId: userId,
        posts: {
          some: {
            id: data.postId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!listWithPost) {
      return { data: false, message: "Post is not in any of the user's lists" };
    }

    return {
      data: true,
      listId: listWithPost.id,
      message: "Post found in user's list",
    };
  } catch (error) {
    return { error: error.message };
  }
};
