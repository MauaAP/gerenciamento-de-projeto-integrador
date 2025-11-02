import { ProjectRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetProjectUseCase } from "./get_project_usecase";
import { GetProjectController } from "./get_project_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new ProjectRepository();

const getProjectUseCase= new GetProjectUseCase(repository.projectRepo, repository.partnerRepo);
const getProjectController= new GetProjectController(getProjectUseCase);

router.get("/project", authenticateToken, async (req: Request, res: Response) => {
    await getProjectController.handler(req, res);
});

export default router;