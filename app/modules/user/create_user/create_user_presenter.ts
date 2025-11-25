import express, { Request, Response } from "express";
import { CreateUserController } from "./create_user_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { CreateUserUseCase } from "./create_user_usecase";
import { UserRepository } from "../../../shared/repositories/repository";


const router = express.Router();
const repository = new UserRepository(); 
const createUserUsecase = new CreateUserUseCase(repository.userRepo);
const createUserController = new CreateUserController(createUserUsecase);

router.post("/user", async (req: Request, res: Response) => {
  await createUserController.handler(req, res);
});

export default router;