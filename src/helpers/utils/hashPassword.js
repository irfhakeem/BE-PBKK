import { genSalt, hash } from "bcrypt";
import { compare } from "bcrypt";

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing password");
  }
}

export { comparePassword, hashPassword };
