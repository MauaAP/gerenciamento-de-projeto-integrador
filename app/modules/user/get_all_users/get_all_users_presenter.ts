import { Repository } from "app/shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllUsersUseCase } from "./get_all_users_usecase";
import { GetAllUsersController } from "./get_all_users_controller";
import { authenticateToken } from "app/shared/middleware/jwt_middleware";

const router= express.Router();
const repository= new Repository(); 
const createUserUsecase= new GetAllUsersUseCase(repository.userRepo);
const userController= new GetAllUsersController(createUserUsecase);

router.get("/users", authenticateToken, async (req: Request, res: Response) => {
    await userController.handler(req, res)
});

export default router;