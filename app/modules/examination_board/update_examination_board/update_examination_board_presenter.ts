import express, { Request, Response } from "express";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { ExaminationBoardRepository } from "app/shared/repositories/repository";
import { UpdateExaminationBoardUseCase } from "./update_examination_board_usecase";
import { UpdateExaminationBoardController } from "./update_examination_board_controller";

const router= express.Router();

const repository= new ExaminationBoardRepository()

const updateExaminationBoardUseCase= new UpdateExaminationBoardUseCase(repository.examinationBoardRepo, repository.userRepo);

const updateExaminationBoardController= new UpdateExaminationBoardController(updateExaminationBoardUseCase);

router.put("/examination-board", authenticateToken, async (req: Request, res: Response) => {
    await updateExaminationBoardController.handler(req, res);
});

export default router;