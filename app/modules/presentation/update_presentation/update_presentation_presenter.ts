import { PresentationRepository } from "../../../shared/repositories/repository";
import { ClassroomRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { UpdatePresentationUseCase } from "./update_presentation_usecase";
import { UpdatePresentationController } from "./update_presentation_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new PresentationRepository();
const classroomRepository = new ClassroomRepository();

const updatePresentationUseCase= new UpdatePresentationUseCase(
    repository.presentationRepo,
    repository.groupRepo,
    repository.examinationBoardRepo,
    repository.userRepo,
    repository.projectRepo,
    repository.partnerRepo,
    classroomRepository.classroomRepo
);

const updatePresentationController= new UpdatePresentationController(updatePresentationUseCase);

router.put("/presentation", authenticateToken, async (req: Request, res: Response) => {
    await updatePresentationController.handler(req, res);
});

export default router;