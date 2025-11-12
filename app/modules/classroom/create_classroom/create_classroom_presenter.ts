import express, { Request, Response } from "express";
import { CreateClassroomController } from "./create_classroom_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { CreateClassroomUseCase } from "./create_classroom_usecase";
import { ClassroomRepository } from "../../../shared/repositories/repository";

const router = express.Router();
const repository = new ClassroomRepository(); 
const createClassroomUsecase = new CreateClassroomUseCase(repository.classroomRepo);
const createClassroomController = new CreateClassroomController(createClassroomUsecase);

router.post("/classroom", authenticateToken, async (req: Request, res: Response) => {
  await createClassroomController.handler(req, res);
});

export default router;

