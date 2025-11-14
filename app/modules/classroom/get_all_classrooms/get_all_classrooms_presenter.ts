import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import express, { Request, Response } from "express";
import { GetAllClassroomsUseCase } from "./get_all_classrooms_usecase";
import { ClassroomRepository } from "../../../shared/repositories/repository";
import { GetAllClassroomsController } from "./get_all_classrooms_controller";

const router = express.Router();
const repository = new ClassroomRepository(); 
const getAllClassroomsUsecase = new GetAllClassroomsUseCase(repository.classroomRepo);
const getAllClassroomsController = new GetAllClassroomsController(getAllClassroomsUsecase);

router.get("/classrooms", authenticateToken, async (req: Request, res: Response) => {
    await getAllClassroomsController.handler(req, res)
});

export default router;

