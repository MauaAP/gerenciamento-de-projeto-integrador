import { GroupRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { GetGroupUseCase } from "./get_group_usecase";
import { GetGroupController } from "./get_group_controller";

const router= express.Router();

const repository= new GroupRepository()

const getGroupUseCase= new GetGroupUseCase(repository.groupRepo, repository.userRepo, repository.projectRepo, repository.partnerRepo, repository.courseRepo);

const getGroupController= new GetGroupController(getGroupUseCase);

router.get("/group", authenticateToken, async (req: Request, res: Response) => {
    await getGroupController.handler(req, res);
});

export default router;