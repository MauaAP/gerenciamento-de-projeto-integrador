import { Repository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetUserUseCase } from "./get_user_usecase";
import { GetUserController } from "./get_user_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();
const repository= new Repository(); 
const createUserUsecase= new GetUserUseCase(repository.userRepo);
const userController= new GetUserController(createUserUsecase);

router.get("/user", authenticateToken, async (req: Request, res: Response) => {
  await userController.handler(req, res);
});

export default router;