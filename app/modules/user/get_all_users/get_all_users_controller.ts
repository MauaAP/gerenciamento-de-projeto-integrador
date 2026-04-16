import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { GetAllUsersUseCase } from "./get_all_users_usecase";
import { GetAllUsersResponse } from "./get_all_users_schema";
import type { User } from "../../../shared/domain/entities/user";

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

        // Validar que userList é um array válido
        if (!Array.isArray(userList)) {
            throw new Error("Lista de usuários inválida");
        }

        const response = GetAllUsersResponse.parse({
            message: "Lista de Usuários retornado com sucesso",
            userList: userList.map((user: User) => {
                // Validar cada usuário antes de mapear
                if (!user || !user.userId || !user.name || !user.email || !user.role) {
                    console.warn("[GetAllUsersController] Usuário inválido encontrado:", user);
                    return null;
                }
                return {
                    id: user.userId,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }).filter(user => user !== null), // Remover usuários inválidos
        });
        res.status(200).json(response)
    }
}