import { UserFromToken } from "../../../shared/middleware/jwt_middleware"
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { GetGroupRequest, GetGroupResponse } from "./get_group_schema";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { GetGroupUseCase } from "./get_group_usecase";

export class GetGroupController {
    constructor(private readonly usecase: GetGroupUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, userId, codSubj, yearSem, projectId, course} = parseBody(
            GetGroupRequest,
            req.query
        );

        const groupList= await this.usecase.execute({
            id,
            groupFilter: {
                userId,
                codSubj,
                yearSem,
                projectId,
                course
            }
        })

        const response= GetGroupResponse.parse({
            message: "Projeto(s) retornado(s) com sucesso",
            groups: groupList.map((group) => ({
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