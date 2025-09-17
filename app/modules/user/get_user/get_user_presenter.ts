import { UserRepository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetUserUseCase } from "./get_user_usecase";
import { GetUserController } from "./get_user_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();
const repository= new UserRepository(); 
const getUserUsecase= new GetUserUseCase(repository.userRepo);
const getUserController= new GetUserController(getUserUsecase);

router.get("/user", authenticateToken, async (req: Request, res: Response) => {
  await getUserController.handler(req, res);
});

export default router;