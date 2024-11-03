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

export const GetRecommendedTags = async () => {
  try {
    const tagsCount = await prisma.tags.count();
    if (tagsCount === 0) {
      return { data: [] };
    }

    const randomSkip =
      tagsCount > 7 ? Math.floor(Math.random() * (tagsCount - 7)) : 0;

    console.log(randomSkip);

    const tags = await prisma.tags.findMany({
      skip: randomSkip,
      take: 7,
    });

    return {
      data: tags,
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const GetTagById = async (data) => {
  try {
    const tag = await prisma.tags.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!tag) {
      return { error: "Tag not found" };
    }

    return {
      data: tag,
    };
  } catch (error) {
    return { error: error.message };
  }
};
