import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { Request, Response } from "express";
import { GetAllGroupsResponse } from "./get_all_groups_schema";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { GetAllGroupsUseCase } from "./get_all_groups_usecase";

export class GetAllGroupsController {
    constructor(private readonly usecase: GetAllGroupsUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken
        
        const allowedRoles = ["ADMIN", "MODERATOR"];

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const groupsList= await this.usecase.execute();

        const response= GetAllGroupsResponse.parse({
            message: "Lista de Grupos retornado com sucesso",
            groups: groupsList.map((group) => ({
                id: group.id,
                codSubj: group.codSubj,
                userNameList: group.userNameList,
                yearSem: group.yearSem,
                project: {
                    title: group.project.title,
                    partnerName: group.project.partnerName,
                    extensionHours: group.project.extensionHours
                },
                course: group.course
            }))
        });
        res.status(200).json(response)
    }
}