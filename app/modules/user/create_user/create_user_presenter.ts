import express, { Request, Response } from "express";
import { CreateUserController } from "./create_user_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { CreateUserUseCase } from "./create_user_usecase";
import { Repository } from "../../../shared/repositories/repository";


const router = express.Router();
const repository = new Repository(); 
const createUserUsecase = new CreateUserUseCase(repository.userRepo);
const userController = new CreateUserController(createUserUsecase);

router.post("/user", authenticateToken, async (req: Request, res: Response) => {
  await userController.handler(req, res);
});

export default router;