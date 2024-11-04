import { PrismaClient } from "@prisma/client";
// import userMassages from "../helpers/messages/user.message";
// import messages from "../helpers/messages/bookmark.message";

const prisma = new PrismaClient();

export const getUserBookmarks = async (userId) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { error: "error user not found" };
    }

    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        userId: userId,
      },
    });

    if (!bookmarks) {
      return { error: "error bookmarks not found" };
    }

    const post = await prisma.posts.findMany({
      where: {
        id: bookmarks.postsId,
      },
    });

    return { data: post };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteBookmark = async (data) => {
  try {
    await prisma.bookmarks.delete({
      where: {
        id: data.id,
      },
    });

    return { message: "deleted" };
  } catch (error) {
    return { error: error.message };
  }
};

export const addBookmark = async (userId, data) => {
  try {
    const bookmark = await prisma.bookmarks.create({
      data: {
        userId: userId,
        postId: data.postId,
      },
    });

    return {
      data: {
        id: bookmark.id,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const isBookmarked = async (userId, data) => {
  try {
    const bookmark = await prisma.bookmarks.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: data.postId,
        },
      },
    });

    return {
      data: {
        isBookmarked: bookmark ? true : false,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};
