import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { parse } from "path";
import { DeletePresentationRequest, DeletePresentationResponse } from "./delete_presentation_schema";
import { DeletePresentationUseCase } from "./delete_presentation_usecase";
export class DeletePresentationController {
    constructor(private readonly usecase: DeletePresentationUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;
        
        const allowedRoles = ["ADMIN", "MODERATOR"];
        
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id}= parseBody(
            DeletePresentationRequest,
            req.body
        );

        const deletedPresentation= await this.usecase.execute(
            id
        )

        const response= DeletePresentationResponse.parse({
            message: "Apresentação deletada com sucesso"
        });
        res.status(200).json(response);
    }
}