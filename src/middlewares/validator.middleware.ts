import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  console.log(errors);

  if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });

    return;
  }

  next();
};
