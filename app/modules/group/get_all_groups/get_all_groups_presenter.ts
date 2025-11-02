import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { GroupRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllGroupsController } from "./get_all_groups_controller";
import { GetAllGroupsUseCase } from "./get_all_groups_usecase";

const router= express.Router();

const repository= new GroupRepository()

const getAllGroupsUseCase= new GetAllGroupsUseCase(repository.groupRepo, repository.userRepo, repository.projectRepo);

const getAllGroupsController= new GetAllGroupsController(getAllGroupsUseCase);

router.get("/groups", authenticateToken, async (req: Request, res: Response) => {
    await getAllGroupsController.handler(req, res);
});

export default router;