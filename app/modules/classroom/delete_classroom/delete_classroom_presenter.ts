import express, { Request, Response } from "express";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { ClassroomRepository } from "app/shared/repositories/repository";
import { DeleteClassroomController } from "./delete_classroom_controller";
import { DeleteClassroomUseCase } from "./delete_classroom_usecase";

const router= express.Router();

const repository= new ClassroomRepository()

const deleteClassroomUseCase= new DeleteClassroomUseCase(repository.classroomRepo);

const deleteClassroomController= new DeleteClassroomController(deleteClassroomUseCase);

router.delete("/classroom", authenticateToken, async (req: Request, res: Response) => {
    await deleteClassroomController.handler(req, res);
});

export default router;