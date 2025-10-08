import { ProjectRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { DeleteProjectUseCase } from "./delete_project_usecase";
import { DeleteProjectController } from "./delete_project_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router()
const repository= new ProjectRepository();

const deleteProjectUseCase= new DeleteProjectUseCase(repository.projectRepo);
const deleteProjectController= new DeleteProjectController(deleteProjectUseCase);

router.delete("/project", authenticateToken, async(req: Request, res:Response) => {
    await deleteProjectController.handler(req, res)
});

export default router;