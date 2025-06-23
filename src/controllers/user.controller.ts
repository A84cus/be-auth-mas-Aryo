import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.user);

      const users = await prisma.user.findMany();

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
