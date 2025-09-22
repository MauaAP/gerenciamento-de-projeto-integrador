import { Express, Request, Response } from "express";
import { userInfo } from "os";
import CreateUserPresenter from "../modules/user/create_user/create_user_presenter";
import AuthPresenter from "../modules/user/auth/auth_presenter";
import DeleteUserPresenter from "../modules/user/delete_user/delete_user_presenter";
import GetAllUsersPresenter from "../modules/user/get_all_users/get_all_users_presenter";
import GetUserPresenter from "../modules/user/get_user/get_user_presenter";
import UpdateUserPresenter from "../modules/user/update_user/update_user_presenter";
import CreatePartnerPresenter from "../modules/partner/create_partner/create_partner_presenter";
import DeletePartnerPresenter from "../modules/partner/delete_partner/delete_partner_presenter";
import GetAllPartnersPresenter from "../modules/partner/get_all_partners/get_all_partners_presenter";
import GetPartnerPresenter from "../modules/partner/get_partner/get_partner_presenter";
import UpdatePartnerPresenter from "../modules/partner/update_partner/update_partner_presenter";

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
  app.use("/api", AuthPresenter);
  // app.use("/api", DeleteUserPresenter);
  // app.use("/api", GetAllUsersPresenter);
  // app.use("/api", GetUserPresenter);
  // app.use("/api", UpdateUserPresenter);

  // Partner
  // app.use("/api", CreatePartnerPresenter);
  // app.use("/api", DeletePartnerPresenter);
  // app.use("/api", GetAllPartnersPresenter);
  // app.use("/api", GetPartnerPresenter);
  // app.use("/api", UpdatePartnerPresenter);
};
