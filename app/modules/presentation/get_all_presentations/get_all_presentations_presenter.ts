import { PresentationRepository } from "../../../shared/repositories/repository";
import { ClassroomRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllPresentationsUseCase } from "./get_all_presentations_usecase";
import { GetAllPresentationsController } from "./get_all_presentations_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository = new PresentationRepository();
const classroomRepository = new ClassroomRepository();

const getPresentationUseCase = new GetAllPresentationsUseCase(
    repository.presentationRepo,
    repository.groupRepo,
    repository.examinationBoardRepo,
    repository.userRepo,
    repository.projectRepo,
    repository.partnerRepo,
    classroomRepository.classroomRepo
);

const getPresentationController = new GetAllPresentationsController(getPresentationUseCase);

router.get("/presentations", authenticateToken, async (req: Request, res: Response) => {
    await getPresentationController.handler(req, res);
});

export default router;