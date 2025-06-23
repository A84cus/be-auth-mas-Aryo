import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

dotenv.config();

interface IDecodedToken {
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IDecodedToken;
  }
}

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.replace("Bearer", "").trim() as string;

  verify(token, process.env.JWT_KEY as string, (error, decodedObject) => {
    if (error) {
      res.status(401).send({
        status: "ERROR",
        message: "User not authorized",
      });

      req.user = decodedObject as IDecodedToken;
    }
  });

  next();
};
