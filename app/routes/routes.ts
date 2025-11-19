import { Express, Request, Response } from "express";
import { userInfo } from "os";
import CreateUserPresenter from "../modules/user/create_user/create_user_presenter";
import AuthPresenter from "../modules/user/auth/auth_presenter";
import DeleteUserPresenter from "../modules/user/delete_user/delete_user_presenter";
import GetAllUsersPresenter from "../modules/user/get_all_users/get_all_users_presenter";
import GetUserPresenter from "../modules/user/get_user/get_user_presenter";
import UpdateUserPresenter from "../modules/user/update_user/update_user_presenter";
import UploadUserXlsxPresenter from "../modules/user/upload_user_xlsx/upload_user_xlsx_presenter";
import CreatePartnerPresenter from "../modules/partner/create_partner/create_partner_presenter";
import DeletePartnerPresenter from "../modules/partner/delete_partner/delete_partner_presenter";
import GetAllPartnersPresenter from "../modules/partner/get_all_partners/get_all_partners_presenter";
import GetPartnerPresenter from "../modules/partner/get_partner/get_partner_presenter";
import UpdatePartnerPresenter from "../modules/partner/update_partner/update_partner_presenter";
import CreateProjectPresenter from "../modules/project/create_project/create_project_presenter";
import DeleteProjectPresenter from "../modules/project/delete_project/delete_project_presenter";
import GetAllProjectsPresenter from "../modules/project/get_all_projects/get_all_projects_presenter";
import GetProjectPresenter from "../modules/project/get_project/get_project_presenter";
import UpdateProjectPresenter from "../modules/project/update_project/update_project_presenter";
import CreateGroupPresenter from "../modules/group/create_group/create_group_presenter";
import DeleteGroupPresenter from "../modules/group/delete_group/delete_group_presenter";
import GetAllGroupsPresenter from "../modules/group/get_all_groups/get_all_groups_presenter";
import GetGroupPresenter from "../modules/group/get_group/get_group_presenter";
import UpdateGroupPresenter from "../modules/group/update_group/update_group_presenter";
import CreatePresentationPresenter from "../modules/presentation/create_presentation/create_presentation_presenter";
import DeletePresentationPresenter from "../modules/presentation/delete_presentation/delete_presentation_presenter";
import GetAllPresentationsPresenter from "../modules/presentation/get_all_presentations/get_all_presentations_presenter";
import GetPresentationPresenter from "../modules/presentation/get_presentation/get_presentation_presenter";
import UpdatePresentationPresenter from "../modules/presentation/update_presentation/update_presentation_presenter";
import CreateExaminationBoardPresenter from "../modules/examination_board/create_examination_board/create_examination_board_presenter";
import DeleteExaminationBoardPresenter from "../modules/examination_board/delete_examination_board/delete_examination_board_presenter";
import GetAllExaminationBoardsPresenter from "../modules/examination_board/get_all_examination_boards/get_all_examination_boards_presenter";
import GetExaminationBoardPresenter from "../modules/examination_board/get_examination_board/get_examination_board_presenter";
import UpdateExaminationBoardPresenter from "../modules/examination_board/update_examination_board/update_examination_board_presenter";
import CreateClassroomPresenter from "../modules/classroom/create_classroom/create_classroom_presenter";
import GetAllClassroomsPresenter from "../modules/classroom/get_all_classrooms/get_all_classrooms_presenter";
import DeleteClassroomPresenter from "../modules/classroom/delete_classroom/delete_classroom_presenter";
import CreateCoursePresenter from "../modules/course/create_course/create_course_presenter";
import GetAllCoursesPresenter from "../modules/course/get_all_courses/get_all_courses_presenter";
import DeleteCoursePresenter from "../modules/course/delete_course/delete_course_presenter";

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
  app.use("/api", DeleteUserPresenter);
  app.use("/api", GetAllUsersPresenter);
  app.use("/api", GetUserPresenter);
  app.use("/api", UpdateUserPresenter);
  app.use("/api", UploadUserXlsxPresenter);

  // Partner
  app.use("/api", CreatePartnerPresenter);
  app.use("/api", DeletePartnerPresenter);
  app.use("/api", GetAllPartnersPresenter);
  app.use("/api", GetPartnerPresenter);
  app.use("/api", UpdatePartnerPresenter);

  // Project
  app.use("/api", CreateProjectPresenter);
  app.use("/api", DeleteProjectPresenter);
  app.use("/api", GetAllProjectsPresenter);
  app.use("/api", GetProjectPresenter);
  app.use("/api", UpdateProjectPresenter);

  // Group
  app.use("/api", CreateGroupPresenter);
  app.use("/api", DeleteGroupPresenter);
  app.use("/api", GetAllGroupsPresenter);
  app.use("/api", GetGroupPresenter);
  app.use("/api", UpdateGroupPresenter);

  // Presentation
  app.use("/api", CreatePresentationPresenter);
  app.use("/api", DeletePresentationPresenter);
  app.use("/api", GetAllPresentationsPresenter);
  app.use("/api", GetPresentationPresenter);
  app.use("/api", UpdatePresentationPresenter);

  // ExaminationBoard
  app.use("/api", CreateExaminationBoardPresenter);
  app.use("/api", DeleteExaminationBoardPresenter);
  app.use("/api", GetAllExaminationBoardsPresenter);
  app.use("/api", GetExaminationBoardPresenter);
  app.use("/api", UpdateExaminationBoardPresenter);

  // Classroom
  app.use("/api", CreateClassroomPresenter);
  app.use("/api", GetAllClassroomsPresenter);
  app.use("/api", DeleteClassroomPresenter);

  // Course
  app.use("/api", CreateCoursePresenter);
  app.use("/api", GetAllCoursesPresenter);
  app.use("/api", DeleteCoursePresenter);
};
