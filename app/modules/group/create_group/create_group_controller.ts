import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware"
import { parseBody } from "app/shared/utils/parse_body";
import { Request, Response } from "express"
import { CreateGroupRequest, CreateGroupResponse } from "./create_group_schema";
import { CreateGroupUseCase } from "./create_group_usecase";

export class CreateGroupController {
    constructor(private readonly usecase: CreateGroupUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR"]
        
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {codSubj, userIdList, yearSem, projectId, course} = parseBody(
            CreateGroupRequest,
            req.body
        );

        const {newGroup, userNameList, projectTitle}= await this.usecase.execute({
            codSubj,
            userIdList,
            yearSem,
            projectId,
            course
        });

        const response= CreateGroupResponse.parse({
            message: "Grupo criado com sucesso",
            group: {
                id: newGroup.groupId,
                codSubj: newGroup.codSubj,
                userNameList: userNameList,
                yearSem: newGroup.yearSem,
                projectTitle: projectTitle,
                course: newGroup.course
            }
        });
        res.status(201).json(response)
    }
}