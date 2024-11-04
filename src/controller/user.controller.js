import messages from "../helpers/messages/user.message.js";
import {
  RegisterUser,
  LoginUser,
  Me,
  UpdateUser,
  DeleteUser,
  GetUserByUsername,
  DeactivateUser,
  FollowUser,
  UnfollowUser,
  IsFollowing,
  GetRandomUsers,
  GetFollowing,
} from "../service/user.service.js";

const _RegisterUser = async (req, res) => {
  try {
    const user = await RegisterUser(req.body);
    if (user.error) {
      return res.status(400).json({ message: user.error });
    }

    res.status(201).json({
      status: "success",
      message: messages.SuccessCreateUser,
      data: user.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const _LoginUser = async (req, res) => {
  try {
    const user = await LoginUser(req.body);
    if (user.error) {
      return res.status(400).json({ message: user.error });
    }

    res.status(200).json({
      status: "success",
      message: messages.SuccessLoginUser,
      data: user.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

const _Me = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Me(userId);
    if (user.error) {
      return res.status(404).json({ message: user.error });
    }

    res.status(200).json({
      status: "success",
      message: messages.SuccessGetUser,
      data: user.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

const _UpdateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UpdateUser(userId, req.body);

    if (user.error) {
      return res.status(400).json({ message: user.error });
    }

    res.status(200).json({
      status: "success",
      message: messages.SuccessUpdateUser,
      data: user.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const _DeleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await DeleteUser(userId);

    if (user.error) {
      return res.status(400).json({ message: user.error });
    }

    res.status(200).json({
      status: "success",
      message: messages.SuccessDeleteUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

const _GetUserByUsername = async (req, res) => {
  try {
    const user = await GetUserByUsername(req.params.username);
    if (user.error) {
      return res.status(404).json({ message: user.error });
    }

    res.status(200).json({
      status: "success",
      message: messages.SuccessGetUser,
      data: user.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

const _GetRandomUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const users = await GetRandomUsers(userId);
    if (users.error) {
      return res.status(400).json({ message: users.error });
    }

    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully.",
      data: users.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const _DeactivateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await DeactivateUser(userId);

    if (user.error) {
      return res.status(400).json({ message: user.error });
    }

    return res.status(200).json({
      status: "success",
      message: user.message,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deactivating user", error });
  }
};

const _FollowUser = async (req, res) => {
  try {
    const userId = req.userId;
    const follow = await FollowUser(userId, req.body);

    if (follow.error) {
      return res.status(400).json({ message: follow.error });
    }

    res.status(200).json({
      status: "success",
      message: "Success Follow user",
      data: follow.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error following user", error });
  }
};

const _UnfollowUser = async (req, res) => {
  try {
    const userId = req.userId;
    const follow = await UnfollowUser(userId, req.body);

    if (follow.error) {
      return res.status(400).json({ message: follow.error });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Error unfollow user ", error });
  }
};

const _IsFollowing = async (req, res) => {
  try {
    const userId = req.userId;
    const follow = await IsFollowing(userId, req.body);

    if (follow.error) {
      return res.status(400).json({ message: follow.error });
    }

    res.status(200).json({
      status: "success",
      message: "User is following",
      data: follow.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error following user", error });
  }
};

const _GetFollowing = async (req, res) => {
  try {
    const userId = req.userId;
    const response = await GetFollowing(userId);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(201).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

export default {
  _LoginUser,
  _RegisterUser,
  _Me,
  _UpdateUser,
  _DeleteUser,
  _GetUserByUsername,
  _GetRandomUsers,
  _DeactivateUser,
  _FollowUser,
  _UnfollowUser,
  _IsFollowing,
  _GetFollowing,
};
