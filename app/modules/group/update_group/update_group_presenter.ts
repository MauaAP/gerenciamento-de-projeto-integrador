import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import express, { Request, Response } from "express";
import { UpdateGroupController } from "./update_group_controller";
import { UpdateGroupUseCase } from "./update_group_usecase";
import { GroupRepository } from "app/shared/repositories/repository";

const router = express.Router();

const repository= new GroupRepository()

const updateGroupUseCase= new UpdateGroupUseCase(repository.groupRepo, repository.userRepo, repository.projectRepo, repository.partnerRepo);

const updateGroupController= new UpdateGroupController(updateGroupUseCase);

router.put("/group", authenticateToken, async (req: Request, res: Response) => {
    await updateGroupController.handler(req, res);
});

export default router;