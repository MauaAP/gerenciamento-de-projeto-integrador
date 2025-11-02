import express, { Request, Response } from "express";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { ExaminationBoardRepository } from "../../../shared/repositories/repository";
import { DeleteExaminationBoardUseCase } from "./delete_examination_board_usecase";
import { DeleteExaminationBoardController } from "./delete_examination_board_controller";

const router= express.Router();

const repository= new ExaminationBoardRepository()

const deleteExaminationBoardUseCase= new DeleteExaminationBoardUseCase(repository.examinationBoardRepo);

const deleteExaminationBoardController= new DeleteExaminationBoardController(deleteExaminationBoardUseCase);

router.delete("/examination-board", authenticateToken, async (req: Request, res: Response) => {
    await deleteExaminationBoardController.handler(req, res);
});

export default router;