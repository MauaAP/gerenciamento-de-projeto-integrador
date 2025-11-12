import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import express, { Request, Response } from "express";
import { GetAllCoursesUseCase } from "./get_all_courses_usecase";
import { CourseRepository } from "../../../shared/repositories/repository";
import { GetAllCoursesController } from "./get_all_courses_controller";

const router = express.Router();
const repository = new CourseRepository(); 
const getAllCoursesUsecase = new GetAllCoursesUseCase(repository.courseRepo);
const getAllCoursesController = new GetAllCoursesController(getAllCoursesUsecase);

router.get("/courses", authenticateToken, async (req: Request, res: Response) => {
    await getAllCoursesController.handler(req, res)
});

export default router;

