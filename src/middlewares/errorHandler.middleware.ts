import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import logger from "../utils/logger";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  console.error(`[Error] ${err.name} : ${err.message}`);

  console.log("Err", err.stack);

  if (err.stack) {
    console.error(err.stack);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({ message: err.message, code: err.code });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.stack });
    return;
  }

  res.status(500).json({
    message: "Internal server error",
    detail: err.message || "Something went wrong",
  });
};
