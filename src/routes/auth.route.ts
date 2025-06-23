import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export default class AuthRoute {
  public router: Router;

  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    // === POST ===
    this.router.post("/register", this.authController.register); // -> /auth/register
    this.router.post("/login", this.authController.login); // -> /auth/login
  }
}
