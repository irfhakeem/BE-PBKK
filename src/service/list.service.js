import { PrismaClient } from "@prisma/client";
import messages from "../helpers/messages/list.message";

const prisma = new PrismaClient();

export const getUserLists = async (userId) => {
  try {
    const lists = await prisma.lists.findMany({
      where: {
        userId: userId,
      },
    });

    if (!lists) {
      return { error: messages.ErrListNotFound };
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

    return { data: list };
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
        description: data.description,
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

export const deleteList = async (listId) => {
  try {
    await prisma.lists.delete({
      where: {
        id: listId,
      },
    });

    return { message: messages.SuccessDeleteList };
  } catch (error) {
    return { error: error.message };
  }
};
