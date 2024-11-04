import {
  addBookmark,
  deleteBookmark,
  getUserBookmarks,
  isBookmarked,
} from "../service/bookmark.service.js";
import messages from "../helpers/messages/bookmark.message.js";

const _addBookmark = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;
    const bookmark = await addBookmark(userId, data);

    if (bookmark.error) {
      return res.status(400).json({ error: bookmark.error });
    }

    return res.status(201).json({
      status: "success",
      message: messages.SuccessAddUserBookmark,
      data: bookmark.data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const _deleteBookmark = async (req, res) => {
  try {
    const result = await deleteBookmark(req.body);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res
      .status(200)
      .json({ message: messages.SuccessDeleteUserBookmark });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const _getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await getUserBookmarks(req.userId);

    if (bookmarks.error) {
      return res.status(400).json({ error: bookmarks.error });
    }

    return res.status(200).json({
      status: "success",
      message: messages.SuccessGetUserBookmark,
      data: bookmarks.data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const _isBookmarked = async (req, res) => {
  try {
    const userId = req.userId;
    const bookmark = await isBookmarked(userId, req.body);

    if (bookmark.error) {
      return res.status(400).json({ error: bookmark.error });
    }

    return res.status(200).json({
      status: "success",
      message: "User bookmarked this post",
      data: bookmark.data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  _addBookmark,
  _deleteBookmark,
  _getUserBookmarks,
  _isBookmarked,
};
