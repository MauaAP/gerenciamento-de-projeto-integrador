import { ProjectRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { GetAllProjectsUseCase } from "./get_all_projects_usecase";
import { GetAllProjectsController } from "./get_all_projects_controller";

const router= express.Router();

const repository= new ProjectRepository();

const getAllProjectUseCase= new GetAllProjectsUseCase(repository.projectRepo, repository.partnerRepo);
const getAllProjectController= new GetAllProjectsController(getAllProjectUseCase);

router.get("/projects", authenticateToken, async (req: Request, res: Response) => {
    await getAllProjectController.handler(req, res);
});

export default router;