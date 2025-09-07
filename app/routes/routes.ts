import { Express, Request, Response } from "express";
import { userInfo } from "os";
import CreateUserPresenter from "../modules/user/create_user/create_user_presenter";

export const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) =>
      res
        .status(200)
        .send("Api Gerenciamento de PI - Instituto Mauá de Tecnologia")
    );

  // User
  app.use("/api", CreateUserPresenter);
  // app.put("/user/:id", updateUser.handler);
};
