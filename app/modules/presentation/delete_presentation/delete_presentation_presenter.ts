import { PresentationRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { DeletePresentationUseCase } from "./delete_presentation_usecase";
import { DeletePresentationController } from "./delete_presentation_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();

const repository= new PresentationRepository();

const deletePresentationUseCase= new DeletePresentationUseCase(
    repository.presentationRepo,
);

const deletePresentationController= new DeletePresentationController(deletePresentationUseCase);

router.delete("/presentation", authenticateToken, async (req: Request, res: Response) => {
    await deletePresentationController.handler(req, res);
});

export default router;