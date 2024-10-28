import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { sign, verify, decode } = jsonwebtoken;
const secretKey = process.env.SECRET_KEY;

export const generateToken = (payload, expiresIn = "2h") => {
  return sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token) => {
  return decode(token);
};
