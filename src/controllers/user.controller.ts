import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import emailer from "../utils/emailer";
import { cloudinaryUpload } from "../utils/cloudinary";

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;

      if (!file) throw new Error("No File Uploaded");

      const { secure_url } = await cloudinaryUpload(file);

      console.log("URL : ", secure_url);

      const users = await prisma.user.findMany();

      // await emailer({
      //   to: "gangsar45@gmail.com",
      //   subject: "Test Email",
      //   pathToHtml: "src/emails/test.html",
      //   replacements: {
      //     name: "Gangsar ARyo",
      //   },
      // });

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
