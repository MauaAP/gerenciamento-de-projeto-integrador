import express, { Request, Response } from "express";
import { CreatePresentationUseCase } from "./create_presentation_usecase";
import { CreatePresentationController } from "./create_presentation_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { PresentationRepository } from "app/shared/repositories/repository";

const router= express.Router();

const repository= new PresentationRepository();

const createPresentationUseCase= new CreatePresentationUseCase(
    repository.presentationRepo,
    repository.groupRepo,
    repository.examinationBoardRepo,
    repository.userRepo,
    repository.projectRepo,
    repository.partnerRepo
);

const createPresentationController= new CreatePresentationController(createPresentationUseCase);

router.post("/presentation", authenticateToken, async (req: Request, res: Response) => {
    await createPresentationController.handler(req, res);
});

export default router;