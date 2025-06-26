import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import emailer from "../utils/emailer";
import { cloudinaryUpload } from "../utils/cloudinary";
// import { redisClient } from "../utils/redis";
import { AppError } from "../errors/AppError";

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // const redisData = await redisClient.get("users"); // localStorage.get("users")

      // if (redisData) {
      //   res.status(200).send({
      //     data: JSON.parse(redisData),
      //     status: "SUCCESS",
      //     message: "Get Users successfully (cache)",
      //   });

      //   return;
      // }

      throw new AppError("Error Testing");

      const users = await prisma.user.findMany();

      // await redisClient.setEx("users", 50, JSON.stringify(users));

      res.status(201).send({
        data: users,
        status: "SUCCESS",
        message: "Get users successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
