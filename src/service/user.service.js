import messages from "../helpers/messages/user.message.js";
import {
  hashPassword,
  comparePassword,
} from "../helpers/utils/hashPassword.js";
import { generateToken } from "./jwt.service.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const RegisterUser = async (data) => {
  try {
    if (data.name === "" || data.email === "" || data.password === "") {
      return { error: messages.ErrCreateUser };
    }

    if (data.password.length < 6) {
      return { error: messages.ErrCreateUser };
    }

    if (await prisma.users.findUnique({ where: { email: data.email } })) {
      return { error: messages.ErrEmailExist };
    }

    const hashedPwd = await hashPassword(data.password);
    const user = await prisma.users.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPwd,
        avatar: data.avatar,
        banner: data.banner,
      },
    });

    if (!user) {
      return { error: messages.ErrCreateUser };
    }

    const list = await prisma.lists.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        title: "Reading List",
      },
    });

    if (!list) {
      return { error: "Error creating reading list" };
    }

    return {
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const LoginUser = async (data) => {
  try {
    if (!data.email || !data.password) {
      return {
        error: "Input validation error: email and password are required.",
      };
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.email }],
      },
    });

    if (!user) {
      return { error: "Email not exist" };
    }

    if (user.loginSuspended && user.loginSuspended > new Date()) {
      return { error: "Account is temporarily suspended. Try again later." };
    }

    const isMatch = await comparePassword(data.password, user.password);

    if (!isMatch) {
      const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: { loginAttempts: user.loginAttempts + 1 },
      });

      if (updatedUser.loginAttempts >= 3) {
        await prisma.users.update({
          where: { id: user.id },
          data: {
            loginSuspended: new Date(Date.now() + 5 * 60 * 1000),
            loginAttempts: 0,
          },
        });
        return {
          error: "Account suspended due to multiple failed login attempts.",
        };
      }

      return { error: "Incorrect password" };
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { loginAttempts: 0, loginSuspended: null, isDeactivated: false },
    });

    return {
      data: {
        id: user.id,
        username: user.username,
        token: generateToken({ id: user.id, username: user.username }, "2h"),
      },
    };
  } catch (error) {
    return { error: "Server error: " + error.message };
  }
};

export const Me = async (id) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return { error: "User not found or deactivated" };
    }

    const followers = await prisma.userFollowers.findMany({
      where: {
        followingId: user.id,
      },
      select: {
        follower: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      data: {
        ...user,
        followers: followers.length,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

// export const GetAllUsers = async (page) => {
//   page = parseInt(page, 10) || 1;
//   if (page < 1) {
//     return { error: messages.InvalidPage };
//   }

//   const limit = 10;
//   const skip = (page - 1) * limit;

//   try {
//     const users = await prisma.users.findMany({
//       skip: skip,
//       take: limit,
//     });

//     if (users.length === 0) {
//       return { error: messages.ErrGetUser };
//     }

//     return { data: users };
//   } catch (error) {
//     return { error: error.message };
//   }
// };

export const UpdateUser = async (id, data) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return { error: messages.ErrUserNotFound };
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        avatar: data.avatar,
        bio: data.bio,
        banner: data.banner,
      },
    });

    if (!updatedUser) {
      return { error: messages.ErrUpdateUser };
    }

    return {
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        banner: updatedUser.banner,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const DeleteUser = async (id) => {
  try {
    await prisma.users.delete({
      where: {
        id: id,
      },
    });

    return { data: "User deleted successfully" };
  } catch (error) {
    return { error: messages.ErrDeleteUser };
  }
};

export const GetUserByUsername = async (username) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username: username,
        isDeactivated: false,
      },
    });

    if (!user) {
      return { error: "User not found or deactivated" };
    }

    const followers = await prisma.userFollowers.findMany({
      where: {
        followingId: user.id,
      },
      select: {
        follower: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      data: {
        ...user,
        followers: followers.length,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const GetRandomUsers = async (userId) => {
  try {
    const users = await prisma.users.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!users) {
      return { error: messages.ErrGetUser };
    }

    return { data: users };
  } catch (error) {
    return { error: error.message };
  }
};

export const DeactivateUser = async (id) => {
  try {
    await prisma.users.update({
      data: {
        isDeactivated: true,
      },
      where: {
        id: id,
      },
    });

    return { message: messages.SuccessDeactivateUser };
  } catch (error) {
    return { error: messages.ErrDeactivateUser };
  }
};

export const FollowUser = async (userId, data) => {
  try {
    const follow = await prisma.userFollowers.create({
      data: {
        followerId: userId,
        followingId: data.followingId,
      },
    });

    return {
      data: {
        followerId: follow.followerId,
        followingId: follow.followingId,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const UnfollowUser = async (userId, data) => {
  try {
    await prisma.userFollowers.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: data.followingId,
        },
      },
    });

    return { message: "Success unfollow user" };
  } catch (error) {
    return { error: error.message };
  }
};

export const IsFollowing = async (userId, data) => {
  try {
    const follow = await prisma.userFollowers.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: data.followingId,
        },
      },
    });

    return {
      data: {
        isFollowing: follow ? true : false,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const GetFollowing = async (userId) => {
  try {
    const following = await prisma.userFollowers.findMany({
      where: {
        followerId: userId,
      },
    });

    return {
      data: {
        followingId: following.map((f) => f.followingId),
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const Search = async (data) => {
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
            isDeactivated: false,
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
                name: {
                  contains: query,
                  mode: "insensitive",
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
            ],
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
            posts: {
              take: 3,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        result = result.map((list) => ({
          ...list,
          username: list.user.username,
          posts: list.posts,
        }));

        break;

      case "tag":
        result = await prisma.tags.findMany({
          where: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        });
        break;
      default:
        return { error: "Invalid type" };
    }

    if (!result) {
      return { error: "No result found" };
    }

    return { data: result };
  } catch (error) {
    return { error: error.message };
  }
};
