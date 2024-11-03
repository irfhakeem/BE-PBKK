import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CreateTag = async (data) => {
  try {
    const tagName = data.name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const existingTag = await prisma.tags.findUnique({
      where: {
        name: tagName,
      },
    });

    if (existingTag) {
      return { error: "Tag already exists" };
    }

    const tag = await prisma.tags.create({
      data: {
        name: tagName,
      },
    });

    return {
      data: {
        id: tag.id,
        name: tag.name,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const GetTags = async () => {
  try {
    const tags = await prisma.tags.findMany({
      take: 8,
    });

    return {
      data: tags,
    };
  } catch (error) {
    return { error: error.message };
  }
};
