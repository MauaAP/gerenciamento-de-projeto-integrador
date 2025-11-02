import { GroupRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { DeleteGroupUseCase } from "./delete_group_usecase";
import { DeleteGroupController } from "./delete_group_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new GroupRepository()

const deleteGroupUseCase= new DeleteGroupUseCase(repository.groupRepo);

const deleteGroupController= new DeleteGroupController(deleteGroupUseCase);

router.delete("/group", authenticateToken, async (req: Request, res: Response) => {
    await deleteGroupController.handler(req, res);
});

export default router;