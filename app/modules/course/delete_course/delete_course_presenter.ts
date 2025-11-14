import express, { Request, Response } from "express";
import { DeleteCourseController } from "./delete_course_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { DeleteCourseUseCase } from "./delete_course_usecase";
import { CourseRepository } from "../../../shared/repositories/repository";

const router = express.Router();
const repository = new CourseRepository(); 
const deleteCourseUsecase = new DeleteCourseUseCase(repository.courseRepo);
const deleteCourseController = new DeleteCourseController(deleteCourseUsecase);

router.delete("/course", authenticateToken, async (req: Request, res: Response) => {
  await deleteCourseController.handler(req, res);
});

export default router;

