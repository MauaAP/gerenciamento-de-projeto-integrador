import express, { Request, Response } from "express";
import { CreateClassroomController } from "./create_classroom_controller";
import { CreateClassroomUseCase } from "./create_classroom_usecase";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { ClassroomRepository } from "app/shared/repositories/repository";

const router= express.Router();

const repository= new ClassroomRepository()

const createClassroomUseCase= new CreateClassroomUseCase(repository.classroomRepo);

const createClassroomController= new CreateClassroomController(createClassroomUseCase);

router.post("/classroom", authenticateToken, async (req: Request, res: Response) => {
    await createClassroomController.handler(req, res);
});

export default router;