import { CreateTag, GetTags } from "../service/tag.service";

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

const _GetTags = async (req, res) => {
  try {
    const response = await GetTags();
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
  _GetTags,
};
