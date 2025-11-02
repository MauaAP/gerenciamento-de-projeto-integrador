import { ForbiddenException } from "app/shared/helpers/exceptions";
import { parseBody } from "app/shared/utils/parse_body";
import { Request, Response } from "express";
import { DeleteGroupRequest, DeleteGroupResponse } from "./delete_group_schema";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { DeleteGroupUseCase } from "./delete_group_usecase";

export class DeleteGroupController {
    constructor(private readonly usecase: DeleteGroupUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;
        
        const allowedRoles = ["ADMIN", "MODERATOR"];
        
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id} = parseBody(
            DeleteGroupRequest,
            req.body
        );

        const deletedGroup= await this.usecase.execute(
            id
        )

        const response= DeleteGroupResponse.parse({
            message: "Grupo deletado com sucesso"
        });
        res.status(200).json(response);
    }
}