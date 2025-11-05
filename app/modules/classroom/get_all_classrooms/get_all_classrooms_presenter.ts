import { ClassroomRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllClassroomsUseCase } from "./get_all_classrooms_usecase";
import { GetAllClassroomsController } from "./get_all_classrooms_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new ClassroomRepository()

const getAllClassroomsUseCase= new GetAllClassroomsUseCase(repository.classroomRepo);

const getAllClassroomsController= new GetAllClassroomsController(getAllClassroomsUseCase);

router.get("/classrooms", authenticateToken, async (req: Request, res: Response) => {
    await getAllClassroomsController.handler(req, res);
});

export default router;