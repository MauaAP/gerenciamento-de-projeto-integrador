import express, { Request, Response } from "express";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { ExaminationBoardRepository } from "app/shared/repositories/repository";
import { CreateExaminationBoardUseCase } from "./create_examination_board_usecase";
import { CreateExaminationBoardController } from "./create_examination_board_controller";

const router= express.Router();

const repository= new ExaminationBoardRepository()

const createExaminationBoardUseCase= new CreateExaminationBoardUseCase(repository.examinationBoardRepo, repository.userRepo);

const createExaminationBoardController= new CreateExaminationBoardController(createExaminationBoardUseCase);

router.post("/examination-board", authenticateToken, async (req: Request, res: Response) => {
    await createExaminationBoardController.handler(req, res);
});

export default router;