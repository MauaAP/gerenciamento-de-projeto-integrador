import express, { Request, Response } from "express";
import { CreateProjectUseCase } from "./create_project_usecase";
import { CreateProjectController } from "./create_project_controller";
import { ProjectRepository } from "../../../shared/repositories/repository";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new ProjectRepository();

const createProjectUseCase = new CreateProjectUseCase(repository.projectRepo, repository.partnerRepo);
const createProjectController = new CreateProjectController(createProjectUseCase);

router.post("/project", authenticateToken, async (req: Request, res: Response) => {
    await createProjectController.handler(req, res);
});

export default router;