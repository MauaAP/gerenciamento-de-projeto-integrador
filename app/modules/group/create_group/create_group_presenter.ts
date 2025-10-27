import { GroupRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { CreateGroupUseCase } from "./create_group_usecase";
import { CreateGroupController } from "./create_group_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new GroupRepository()

const createGroupUseCase= new CreateGroupUseCase(repository.groupRepo, repository.userRepo, repository.projectRepo);

const createGroupController= new CreateGroupController(createGroupUseCase);

router.post("/group", authenticateToken, async (req: Request, res: Response) => {
    await createGroupController.handler(req, res);
});

export default router;