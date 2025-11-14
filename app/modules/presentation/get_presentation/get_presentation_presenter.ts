import { PresentationRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetPresentationUseCase } from "./get_presentation_usecase";
import { GetPresentationController } from "./get_presentation_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new PresentationRepository();

const getPresentationUseCase= new GetPresentationUseCase(
    repository.presentationRepo,
    repository.groupRepo,
    repository.examinationBoardRepo,
    repository.userRepo,
    repository.projectRepo,
    repository.partnerRepo
);

const getPresentationController= new GetPresentationController(getPresentationUseCase);

router.get("/presentation", authenticateToken, async (req: Request, res: Response) => {
    await getPresentationController.handler(req, res);
});

export default router;