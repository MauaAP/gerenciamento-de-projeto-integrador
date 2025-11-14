import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware"
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express"
import { CreateProjectRequest, CreateProjectResponse } from "./create_project_schema";
import { CreateProjectUseCase } from "./create_project_usecase";
export class CreateProjectController {
    constructor(private readonly usecase: CreateProjectUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR"]

        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {title, partnerId, extensionHours} = parseBody(
            CreateProjectRequest,
            req.body
        );

        const {newProject, partnerName} = await this.usecase.execute({
            title,
            partnerId,
            extensionHours
        })

        const response= CreateProjectResponse.parse({
            message: "Projeto criado com sucesso",
            project : {
                id: newProject.projectId,
                title: newProject.title,
                partnerName: partnerName,
                extensionHours: newProject.extensionHours
            }
        });
        res.status(201).json(response)
    }
}