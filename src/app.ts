import express, { Express, json, Request, Response, urlencoded } from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import AuthRoute from "./routes/auth.route";
import UserRoute from "./routes/user.route";

const PORT = 8000;

export default class App {
  private app: Express;

  constructor() {
    this.app = express();

    this.configure();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private configure(): void {
    this.app.use(cors());

    // parses incoming requests body with JSON payloads (if the header sets to application/json)
    this.app.use(json());

    /**
     * parses incoming requests body with JSON payloads (if the header sets to application/x-www-form-urlencoded)
     * ex : firstName=John&lastName=Doe&email=john.doe%40example.com
     * to : req.body = {
                firstName   : "John",
                lastName    : "Doe",
                email       : "john.doe@example.com"
            };
     * extended: true -> using qs instead of querystring to parse data, to allow parsing nested objects and arrays
    */
    this.app.use(urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.get("/", (_req: Request, res: Response) => {
      res.status(200).send("Hello Purwadhika");
    });

    this.app.use("/auth", new AuthRoute().router);
    this.app.use("/users", new UserRoute().router);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public start(): void {
    this.app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
  }
}
