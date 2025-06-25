import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { userAuth } from "../middlewares/auth.middleware";
import { memoryUploader, multipleFileDiffField } from "../utils/uploader";

export default class UserRoute {
  public router: Router;

  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    // === GET ===
    this.router.get(
      "/",
      memoryUploader().single("file"),
      this.userController.getUsers
    ); // -> /users
  }
}
