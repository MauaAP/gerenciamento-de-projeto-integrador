import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { DeleteUserUseCase } from "./delete_user_usecase";
import { DeleteUserRequest, DeleteUserResponse } from "./delete_user_schema";
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
            DeleteUserRequest,
            req.body
        );

        await this.usecase.execute({
            id,
            isAdmin
        })

        const response = DeleteUserResponse.parse({
            message: "Usuário deletado com sucesso"
        });
        res.status(200).json(response);
    }
}
