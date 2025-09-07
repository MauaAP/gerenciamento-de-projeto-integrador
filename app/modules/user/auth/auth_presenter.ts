import express, { Request, Response } from "express";
import { AuthController } from "./auth_controller";
import { AuthUseCase } from "./auth_usecase";
import { Repository } from "../../../shared/repositories/repository";

const router = express.Router();
const repository = new Repository();
const authUsecase = new AuthUseCase(repository.userRepo);
const authController = new AuthController(authUsecase);

router.post("/login", async (req: Request, res: Response) => {
  await authController.handler(req, res);
});

export default router;
