import { PresentationRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { UpdatePresentationUseCase } from "./update_presentation_usecase";
import { UpdatePresentationController } from "./update_presentation_controller";

const router= express.Router();

const repository= new PresentationRepository();

const updatePresentationUseCase= new UpdatePresentationUseCase(
    repository.presentationRepo,
    repository.groupRepo,
    repository.examinationBoardRepo,
    repository.userRepo,
    repository.projectRepo,
);

const updatePresentationController= new UpdatePresentationController(updatePresentationUseCase);

router.put("/presentation", async (req: Request, res: Response) => {
    await updatePresentationController.handler(req, res);
});

export default router;