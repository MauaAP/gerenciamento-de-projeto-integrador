import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { GetProjectRequest, GetProjectResponse } from "./get_project_schema";
import { Project } from "../../../shared/domain/entities/project";
import { GetProjectUseCase } from "./get_project_usecase";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
export class GetProjectController {
    constructor(private readonly usecase: GetProjectUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken

        const alloweRoles= ["ADMIN", "MODERATOR"]

        if(!alloweRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, partnerId} = parseBody (
            GetProjectRequest,
            req.query
        )

        const projectList= await this.usecase.execute({
            id,
            partnerId
        });

        const response= GetProjectResponse.parse({
            message: "Projeto(s) retornado(s) com sucesso",
            projects: projectList.map((project) => ({
                id: project.projectId,
                title: project.title,
                partnerName: project.partnerName,
                extensionHours: project.extensionHours
            }))
        });
        res.status(200).json(response)
    }
}