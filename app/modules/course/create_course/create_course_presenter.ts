import express, { Request, Response } from "express";
import { CreateCourseController } from "./create_course_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { CreateCourseUseCase } from "./create_course_usecase";
import { CourseRepository } from "../../../shared/repositories/repository";

const router = express.Router();
const repository = new CourseRepository(); 
const createCourseUsecase = new CreateCourseUseCase(repository.courseRepo);
const createCourseController = new CreateCourseController(createCourseUsecase);

router.post("/course", authenticateToken, async (req: Request, res: Response) => {
  await createCourseController.handler(req, res);
});

export default router;

