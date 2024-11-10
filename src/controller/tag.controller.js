import {
  CreateTag,
  GetRecommendedTags,
  GetTagById,
  GetContentByTag,
  GetRecommendedDetail,
  GetAllTags,
} from "../service/tag.service.js";

const _CreateTag = async (req, res) => {
  try {
    const response = await CreateTag(req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(201).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _GetRecommendedTags = async (req, res) => {
  try {
    const response = await GetRecommendedTags();
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _GetTagById = async (req, res) => {
  try {
    const response = await GetTagById(req.params.id);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _GetContentByTag = async (req, res) => {
  try {
    const response = await GetContentByTag(req.body);
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

const _GetRecommendedDetail = async (req, res) => {
  try {
    const response = await GetRecommendedDetail(req.query);

    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const _GetAllTags = async (req, res) => {
  try {
    const response = await GetAllTags();
    if (response.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ message: response.error });
  }
};

export default {
  _CreateTag,
  _GetRecommendedTags,
  _GetTagById,
  _GetContentByTag,
  _GetRecommendedDetail,
  _GetAllTags,
};
