import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { parseBody } from "app/shared/utils/parse_body";
import { Request, Response } from "express";
import { UpdateProjectRequest, UpdateProjectResponse } from "./update_project_schema";
import { UpdateProjectUseCase } from "./update_project_usecase";

export class UpdateProjectController {
    constructor(private readonly usecase: UpdateProjectUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken
        
        const allowedRoles= ["ADMIN", "MODERATOR"];

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, title, partnerId, extensionHours} = parseBody(
            UpdateProjectRequest,
            req.body
        );

        const {updatedProject, partnerName}= await this.usecase.execute({
            id,
            updateOptions : {
                title,
                partnerId,
                extensionHours
            }
        })

        const response = UpdateProjectResponse.parse({
            message: "Projeto foi alterado com sucesso",
            project: {
                id: updatedProject.projectId,
                title: updatedProject.title,
                partnerName: partnerName,
                extensionHours: updatedProject.extensionHours
            }
        });
        res.status(200).json(response)
    }
}