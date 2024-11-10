import {
  createList,
  deleteList,
  getSpecificList,
  getUserLists,
  getMyLists,
  addPostToList,
  removePostFromList,
  isPostListed,
  updateList,
} from "../service/list.service.js";

const _createList = async (req, res) => {
  try {
    const userId = req.userId;
    const response = await createList(userId, req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(201).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _getMyLists = async (req, res) => {
  try {
    const response = await getMyLists(req.userId);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _getSpecificList = async (req, res) => {
  try {
    const response = await getSpecificList(req.params.id);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _deleteList = async (req, res) => {
  try {
    const response = await deleteList(req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ message: response.message });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _getUserLists = async (req, res) => {
  try {
    const response = await getUserLists(req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _addPostToList = async (req, res) => {
  try {
    const response = await addPostToList(req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _removePostFromList = async (req, res) => {
  try {
    const response = await removePostFromList(req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _isPostListed = async (req, res) => {
  try {
    const userId = req.userId;
    const response = await isPostListed(userId, req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({
      message: response.message,
      data: {
        isListed: response.data,
        listId: response.listId,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _updateList = async (req, res) => {
  try {
    const response = await updateList(req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

export default {
  _createList,
  _getMyLists,
  _getSpecificList,
  _deleteList,
  _getUserLists,
  _addPostToList,
  _removePostFromList,
  _isPostListed,
  _updateList,
};
