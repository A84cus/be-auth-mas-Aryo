import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import prisma from "../prisma";
import { HttpError } from "../errors/HttpError";
import { generateToken } from "../services/jwt.service";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as User;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        throw new HttpError(401, "User is already registered");
      }

      const salt = await genSalt(10); // random string added to a password before hashing
      const hashedPassword = await hash(password, salt);

      const userPayload = {
        name,
        email,
        password: hashedPassword,
      };

      await prisma.user.create({
        data: userPayload,
      });

      res.status(201).send({
        status: "SUCCESS",
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as User;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new HttpError(401, "Invalid email or password");
      }

      const { password: existingPassword, ...restUser } = user;

      const isValidPassword = await compare(password, existingPassword);

      if (!isValidPassword) {
        throw new HttpError(401, "Invalid email or password");
      }

      const dataToken = {
        email: user.email,
      };

      const token = generateToken(dataToken, "1h");

      const resUser = {
        ...restUser,
        token,
      };

      res.status(201).send({
        data: resUser,
        status: "SUCCESS",
        message: "Login successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
