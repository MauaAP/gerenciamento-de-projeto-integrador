import { Repository } from "app/shared/repositories/repository";
import { UpdateUserController } from "./update_user_controller";
import { UpdateUserUseCase } from "./update_user_usecase";
import express, { Request, Response } from "express";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router = express.Router();
const repository = new Repository(); 
const createUserUsecase = new UpdateUserUseCase(repository.userRepo);
const userController = new UpdateUserController(createUserUsecase);

router.put("/user", authenticateToken, async (req: Request, res: Response) => {
   await userController.handler(req, res);
});

export default router;