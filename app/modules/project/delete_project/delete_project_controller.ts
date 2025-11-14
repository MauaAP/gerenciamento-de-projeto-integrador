import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { DeleteProjectRequest, DeleteProjectResponse } from "./delete_project_schema";
import { DeleteProjectUseCase } from "./delete_project_usecase";

export class DeleteProjectController {
    constructor(private readonly usecase: DeleteProjectUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];
        
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id} = parseBody(
            DeleteProjectRequest,
            req.body
        );

        const deletedUser= await this.usecase.execute(
            id
        )

        const response= DeleteProjectResponse.parse({
            message: "Projeto deletado com sucesso"
        });
        res.status(200).json(response)
    }
}