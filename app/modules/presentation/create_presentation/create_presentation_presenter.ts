import express, { Request, Response } from "express";
import { CreatePresentationUseCase } from "./create_presentation_usecase";
import { CreatePresentationController } from "./create_presentation_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { PresentationRepository } from "../../../shared/repositories/repository";
import { ClassroomRepository } from "../../../shared/repositories/repository";

const router= express.Router();

const repository= new PresentationRepository();
const classroomRepository = new ClassroomRepository();

const createPresentationUseCase= new CreatePresentationUseCase(
    repository.presentationRepo,
    repository.groupRepo,
    repository.examinationBoardRepo,
    repository.userRepo,
    repository.projectRepo,
    repository.partnerRepo,
    classroomRepository.classroomRepo
);

const createPresentationController= new CreatePresentationController(createPresentationUseCase);

router.post("/presentation", authenticateToken, async (req: Request, res: Response) => {
    await createPresentationController.handler(req, res);
});

export default router;