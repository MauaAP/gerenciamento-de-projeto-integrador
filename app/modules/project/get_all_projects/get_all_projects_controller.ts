import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { GetAllProjectsResponse } from "./get_all_projects_schema";
import { ForbiddenException } from "app/shared/helpers/exceptions";
import { GetAllProjectsUseCase } from "./get_all_projects_usecase";

export class GetAllProjectsController {
    constructor(private readonly usecase: GetAllProjectsUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const projectList= await this.usecase.execute();

        const response= GetAllProjectsResponse.parse({
            message: "Lista de Projetos retornado com sucesso",
            projectList: projectList.map((project) => ({
                id: project.projectId,
                title: project.title,
                partnerName: project.partnerName,
                extensionHours: project.extensionHours
            }))
        });
        res.status(200).json(response)
    }
}