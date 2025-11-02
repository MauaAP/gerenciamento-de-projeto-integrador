import { ProjectRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { UpdateProjectUseCase } from "./update_project_usecase";
import { UpdateProjectController } from "./update_project_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new ProjectRepository();

const updateProjectUseCase= new UpdateProjectUseCase(repository.projectRepo, repository.partnerRepo)
const updateProjectController= new UpdateProjectController(updateProjectUseCase)

router.put("/project", authenticateToken, async (req: Request,  res: Response) => {
    await updateProjectController.handler(req, res);
});

export default router;