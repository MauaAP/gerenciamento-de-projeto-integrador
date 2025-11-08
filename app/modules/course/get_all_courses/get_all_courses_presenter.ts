import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { CourseRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllCoursesUseCase } from "./get_all_courses_usecase";
import { GetAllCoursesController } from "./get_all_courses_controller";

const router= express.Router();

const repository= new CourseRepository()

const getAllCoursesUseCase= new GetAllCoursesUseCase(repository.courseRepo);

const getAllCoursesController= new GetAllCoursesController(getAllCoursesUseCase);

router.get("/course", authenticateToken, async (req: Request, res: Response) => {
    await getAllCoursesController.handler(req, res);
});

export default router;