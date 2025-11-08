import { CourseRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { CreateCourseUseCase } from "./create_course_usecase";
import { CreateCourseController } from "./create_course_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new CourseRepository()

const createCourseUseCase= new CreateCourseUseCase(repository.courseRepo);

const createCourseController= new CreateCourseController(createCourseUseCase);

router.post("/course", authenticateToken, async (req: Request, res: Response) => {
    await createCourseController.handler(req, res);
});

export default router;