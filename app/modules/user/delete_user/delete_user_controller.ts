
import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { parseBody } from "app/shared/utils/parse_body";
import { DeleteUserUseCase } from "./delete_user_usecase";
import { RegisterDeleteUserRequest, RegisterDeleteUserResponse } from "./delete_user_schema";
import { Request, Response } from "express";

export class DeleteUserController {
    constructor(private readonly usecase: DeleteUserUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;
        const allowedRoles = ["ADMIN", "MODERATOR"];
        let isAdmin= false

        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        if (userFromToken.role === "ADMIN"){
            isAdmin= true;
        }

        const {id} = parseBody(
            RegisterDeleteUserRequest,
            req.body
        );

        const deletedUser = await this.usecase.execute({
            id,
            isAdmin
        })

        const response = RegisterDeleteUserResponse.parse({
            message: "Usuário deletado com sucesso",
            deleted_user: {
                id: deletedUser.userId,
                name: deletedUser.name,
                email: deletedUser.email,
            }
        });
        res.status(201).json(response);
    }
}
