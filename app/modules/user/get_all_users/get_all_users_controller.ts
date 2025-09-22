import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { GetAllUsersUseCase } from "./get_all_users_usecase";
import { GetAllUsersResponse } from "./get_all_users_schema";

export class GetAllUsersController {
    constructor(private readonly usecase: GetAllUsersUseCase) {}
    
    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken

        const allowedRoles = ["ADMIN"];

        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const userList= await this.usecase.execute();

        const response= GetAllUsersResponse.parse({
            message: "Lista de Usuários retornado com sucesso",
            userList
        });
        res.status(200).json(response)
    }
}