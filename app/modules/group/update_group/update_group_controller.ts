import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { UpdateGroupRequest, UpdateGroupResponse } from "./update_group_schema";
import { UpdateGroupUseCase } from "./update_group_usecase";

export class UpdateGroupController{
    constructor(private readonly usecase: UpdateGroupUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR"];

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, codSubj, userIdList, yearSem, projectId, course}= parseBody(
            UpdateGroupRequest,
            req.body
        );

        const updatedGroup= await this.usecase.execute({
            id,
            updateOptions: {
                codSubj,
                userIdList,
                yearSem,
                projectId,
                course
            }
        })

        const response= UpdateGroupResponse.parse({
            message: "Grupo foi alterado com sucesso",
            group: {
                id: updatedGroup.id,
                codSubj: updatedGroup.codSubj,
                userNameList: updatedGroup.userNameList,
                yearSem: updatedGroup.yearSem,
                project: {
                    title: updatedGroup.project.title,
                    partnerName: updatedGroup.project.partnerName,
                    extensionHours: updatedGroup.project.extensionHours
                },
                course: updatedGroup.course
            }
        });
        res.status(200).json(response)
    }
}