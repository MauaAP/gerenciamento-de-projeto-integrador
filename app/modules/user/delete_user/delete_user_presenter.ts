import { Repository } from "app/shared/repositories/repository";
import { DeleteUserUseCase } from "./delete_user_usecase";
import { DeleteUserController } from "./delete_user_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";
import express, { Request, Response } from "express";

const router= express.Router()
const repository = new Repository();
const userUsecase= new DeleteUserUseCase(repository.userRepo)
const userController= new DeleteUserController(userUsecase)

router.delete("/user", authenticateToken, async(req: Request, res: Response) =>{
    await userController.handler(req, res)
});

export default router;
