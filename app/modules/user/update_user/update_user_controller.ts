import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { parseBody } from "app/shared/utils/parse_body";
import { UpdateUserRequest, UpdateUserResponse } from "./update_user_schema";
import { UpdateUserUseCase } from "./update_user_usecase";
import { Request, Response } from "express";

export class UpdateUserController{
    constructor(private readonly usecase: UpdateUserUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR"];

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, name, email, role, password} = parseBody(
            UpdateUserRequest,
            req.body
        );

        if (userFromToken.role === "MODERATOR" && role === "ADMIN"){
            throw new ForbiddenException(
                "Você não tem permissão para alterar uma role para admin"
            );
        }

        const updateUser= await this.usecase.execute({
            id,
            updateOptions: {
                name,
                email,
                role,
                password
            }
        });

        const response = UpdateUserResponse.parse({
            message: "Usuário foi alterado com sucesso",
            user: {
                id: updateUser.userId,
                name: updateUser.name,
                role: updateUser.role,
                email: updateUser.email
            }
        })
        res.status(200).json(response)
    }
}