import express, { Request, Response } from "express";
import { DeleteClassroomController } from "./delete_classroom_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { DeleteClassroomUseCase } from "./delete_classroom_usecase";
import { ClassroomRepository } from "../../../shared/repositories/repository";

const router = express.Router();
const repository = new ClassroomRepository(); 
const deleteClassroomUsecase = new DeleteClassroomUseCase(repository.classroomRepo);
const deleteClassroomController = new DeleteClassroomController(deleteClassroomUsecase);

router.delete("/classroom", authenticateToken, async (req: Request, res: Response) => {
  await deleteClassroomController.handler(req, res);
});

export default router;

