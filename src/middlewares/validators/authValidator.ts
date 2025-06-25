import { body } from "express-validator";
import { validatorMiddleware } from "../validator.middleware";

export const registerValidator = [
  body("name").notEmpty().withMessage("Name is required field"),
  body("email").notEmpty().isEmail().withMessage("Email is required field"),
  body("password").notEmpty().withMessage("Password is required field"),
  validatorMiddleware,
];
