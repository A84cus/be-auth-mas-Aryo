import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { UserImage } from "@prisma/client";

export class UserImageController {
  async createUserImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body as UserImage;

      const payload = (req.files as Express.Multer.File[]).map((file) => {
        return {
          userId: Number(userId),
          urlImage: file.path,
        };
      });

      await prisma.userImage.createMany({
        data: payload,
      });

      res.status(201).send({
        status: "SUCCESS",
        message: "Create user images successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
