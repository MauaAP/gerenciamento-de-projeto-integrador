import express, { Request, Response } from "express";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { ExaminationBoardRepository } from "../../../shared/repositories/repository";
import { GetExaminationBoardUseCase } from "./get_examination_board_usecase";
import { GetExaminationBoardController } from "./get_examination_board_controller";

const router= express.Router();

const repository= new ExaminationBoardRepository()

const getExaminationBoardUseCase= new GetExaminationBoardUseCase(repository.examinationBoardRepo, repository.userRepo);

const getExaminationBoardController= new GetExaminationBoardController(getExaminationBoardUseCase);

router.get("/examination-board", authenticateToken, async (req: Request, res: Response) => {
    await getExaminationBoardController.handler(req, res);
});

export default router;