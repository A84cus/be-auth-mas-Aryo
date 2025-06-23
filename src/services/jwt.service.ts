import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (
  payload: any,
  time?: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, process.env.JWT_KEY as string, { expiresIn: time });
};
