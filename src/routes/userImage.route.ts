import { Router } from "express";
import {
  multipleFileDiffField,
  multipleFileSameField,
} from "../utils/uploader";
import { UserImageController } from "../controllers/userImage.controller";

export default class UserImageRoute {
  public router: Router;

  private userImageController: UserImageController;

  constructor() {
    this.router = Router();
    this.userImageController = new UserImageController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    // === GET ===
    this.router.get(
      "/",
      multipleFileSameField("USER", "/user", 3),
      this.userImageController.createUserImages
    ); // -> /users
  }
}
