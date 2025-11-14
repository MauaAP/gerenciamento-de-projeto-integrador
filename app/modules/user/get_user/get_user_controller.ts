import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { GetUserRequest, GetUserResponse } from "./get_user_schema";
import { GetUserUseCase } from "./get_user_usecase";

export class GetUserController {
    constructor(private readonly usecase: GetUserUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        let isAdmin= false;

        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        if (userFromToken.role === "ADMIN"){
            isAdmin= true;
        }

        const {id, email} = parseBody (
            GetUserRequest,
            req.query
        )

        const selectedUser= await this.usecase.execute({
            id,
            email,
            isAdmin
        });

        const response= GetUserResponse.parse({
            message: "Usuário retornado com sucesso",
            user: {
                id: selectedUser.userId,
                name: selectedUser.name,
                role: selectedUser.role,
                email: selectedUser.email,
            }
        });
        res.status(200).json(response)
    }
}