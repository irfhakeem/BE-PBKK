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
      tagsCount > 8 ? Math.floor(Math.random() * (tagsCount - 8)) : 0;

    console.log(randomSkip);

    const tags = await prisma.tags.findMany({
      skip: randomSkip,
      take: 8,
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

export const GetContentByTag = async (data) => {
  try {
    // Cari tag berdasarkan nama yang diberikan
    const tag = await prisma.tags.findUnique({
      where: {
        name: data.name,
      },
    });

    if (!tag) {
      return { error: "Tag not found" };
    }

    // Cari posts yang memiliki tag atau judul/caption yang mengandung kata yang sama
    const posts = await prisma.posts.findMany({
      where: {
        OR: [
          {
            tags: {
              some: {
                tag: {
                  name: {
                    equals: data.name,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            title: {
              contains: data.name,
              mode: "insensitive",
            },
          },
          {
            caption: {
              contains: data.name,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 8,
      include: {
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    // Add likeCount and commentCount to posts
    const postsWithCounts = posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    }));

    // Cari users yang memiliki posts dengan tag yang sama
    const users = await prisma.users.findMany({
      where: {
        OR: [
          {
            posts: {
              some: {
                tags: {
                  some: {
                    tag: {
                      name: {
                        equals: data.name,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
          },
          {
            bio: {
              contains: data.name,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 5,
      include: {
        _count: {
          select: { followers: true },
        },
      },
    });

    const usersWithCounts = users.map((user) => ({
      ...user,
      followerCount: user._count.followers,
    }));

    // Cari lists yang memiliki posts dengan tag yang sama atau judul yang mengandung kata yang sama
    const lists = await prisma.lists.findMany({
      where: {
        OR: [
          {
            posts: {
              some: {
                tags: {
                  some: {
                    tag: {
                      name: {
                        equals: data.name,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
          },
          {
            title: {
              contains: data.name,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        posts: {
          take: 3,
          include: {
            _count: {
              select: { likes: true, comments: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // Find usernames of users whose userId appears in lists
    const userIds = lists.map((list) => list.userId);
    const usersInLists = await prisma.users.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    const listsWithCounts = lists.map((list) => ({
      ...list,
      posts: list.posts.map((post) => ({
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      })),
    }));

    const listsWithUsernames = listsWithCounts.map((list) => ({
      ...list,
      username:
        usersInLists.find((user) => user.id === list.userId)?.username || null,
    }));

    return {
      data: {
        tag,
        posts: postsWithCounts.sort((a, b) => b.likeCount - a.likeCount),
        users: usersWithCounts.sort(
          (a, b) => b.followerCount - a.followerCount
        ),
        lists: listsWithUsernames.sort(
          (a, b) => b.posts.length - a.posts.length
        ),
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const GetRecommendedDetail = async (data) => {
  try {
    const { query, type } = data;

    if (!query || !type) {
      return { error: "Query and type are required" };
    }

    let result;

    switch (type) {
      case "post":
        result = await prisma.posts.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                caption: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                tags: {
                  some: {
                    tag: {
                      name: {
                        contains: query,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            ],
          },
          include: {
            _count: {
              select: { likes: true, comments: true },
            },
          },
        });
        result = result.map((post) => ({
          ...post,
          likeCount: post._count.likes,
          commentCount: post._count.comments,
        }));
        break;

      case "user":
        result = await prisma.users.findMany({
          where: {
            OR: [
              {
                username: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                bio: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                posts: {
                  some: {
                    tags: {
                      some: {
                        tag: {
                          name: {
                            contains: query,
                            mode: "insensitive",
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          include: {
            _count: {
              select: { followers: true },
            },
          },
        });
        result = result.map((user) => ({
          ...user,
          followerCount: user._count.followers,
        }));
        break;

      case "list":
        result = await prisma.lists.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                posts: {
                  some: {
                    tags: {
                      some: {
                        tag: {
                          name: {
                            contains: query,
                            mode: "insensitive",
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          include: {
            posts: {
              include: {
                _count: {
                  select: { likes: true, comments: true },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        const userIds = result.map((list) => list.userId);
        const usersInLists = await prisma.users.findMany({
          where: {
            id: {
              in: userIds,
            },
          },
          select: {
            id: true,
            username: true,
          },
        });
        result = result.map((list) => ({
          ...list,
          posts: list.posts.map((post) => ({
            ...post,
            likeCount: post._count.likes,
            commentCount: post._count.comments,
          })),
          username:
            usersInLists.find((user) => user.id === list.userId)?.username ||
            null,
        }));
        break;

      default:
        return { error: "Invalid type" };
    }

    return { data: result };
  } catch (error) {
    return { error: error.message };
  }
};
