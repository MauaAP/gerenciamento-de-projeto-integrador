import { UserRepository } from "app/shared/repositories/repository";
import { UpdateUserController } from "./update_user_controller";
import { UpdateUserUseCase } from "./update_user_usecase";
import express, { Request, Response } from "express";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router = express.Router();
const repository = new UserRepository(); 
const updateUserUsecase = new UpdateUserUseCase(repository.userRepo);
const updateUserController = new UpdateUserController(updateUserUsecase);

router.put("/user", authenticateToken, async (req: Request, res: Response) => {
   await updateUserController.handler(req, res);
});

export default router;