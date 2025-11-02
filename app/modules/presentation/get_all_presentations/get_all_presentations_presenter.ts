import { PresentationRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllPresentationsUseCase } from "./get_all_presentations_usecase";
import { GetAllPresentationsController } from "./get_all_presentations_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router = express.Router();

const repository = new PresentationRepository();

const getPresentationUseCase = new GetAllPresentationsUseCase(
    repository.presentationRepo,
    repository.groupRepo,
    repository.examinationBoardRepo,
    repository.userRepo,
    repository.projectRepo,
    repository.partnerRepo
);

const getPresentationController = new GetAllPresentationsController(getPresentationUseCase);

router.get("/presentations", authenticateToken, async (req: Request, res: Response) => {
    await getPresentationController.handler(req, res);
});

export default router;