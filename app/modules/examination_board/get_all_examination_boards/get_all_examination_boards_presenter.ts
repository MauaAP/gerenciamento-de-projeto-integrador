import express, { Request, Response } from "express";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import { ExaminationBoardRepository } from "app/shared/repositories/repository";
import { GetAllExaminationBoardsUseCase } from "./get_all_examination_boards_usecase";
import { GetAllExaminationBoardsController } from "./get_all_examination_boards_controller";

const router= express.Router();

const repository= new ExaminationBoardRepository()

const getAllExaminationBoardsUseCase= new GetAllExaminationBoardsUseCase(repository.examinationBoardRepo, repository.userRepo);

const getAllExaminationBoardsController= new GetAllExaminationBoardsController(getAllExaminationBoardsUseCase);

router.get("/examination-boards", authenticateToken, async (req: Request, res: Response) => {
    await getAllExaminationBoardsController.handler(req, res);
});

export default router;