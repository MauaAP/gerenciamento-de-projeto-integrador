import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { CourseRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { DeleteCourseController } from "./delete_course_controller";
import { DeleteCourseUseCase } from "./delete_course_usecase";

const router= express.Router();

const repository= new CourseRepository()

const deleteCourseUseCase= new DeleteCourseUseCase(repository.courseRepo);

const deleteCourseController= new DeleteCourseController(deleteCourseUseCase);

router.delete("/course", authenticateToken, async (req: Request, res: Response) => {
    await deleteCourseController.handler(req, res);
});

export default router;