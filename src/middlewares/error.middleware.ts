import { NextFunction, Request, Response } from "express";
import fs from "fs";

interface HttpException extends Error {
  status: number;
}

export const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  const timestamp = new Date().toISOString();

  const logMessage = `${timestamp} - ${message}`;

  fs.appendFile("error.log", logMessage, (err) => {
    if (err) {
      console.error("Error writing to the log file : ", err.message);
    }
  });

  res.status(status).send(message);
};
