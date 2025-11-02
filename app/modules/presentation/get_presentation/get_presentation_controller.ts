import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { GetPresentationRequest, GetPresentationResponse } from "./get_presentation_schema";
import { GetPresentationUseCase } from "./get_presentation_usecase";

export class GetPresentationController {
    constructor(private readonly usecase: GetPresentationUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR", "PROFESSOR", "STUDENT"];

        if (!allowedRoles.includes(userFromToken.role))
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );

        const { id, date, groupId, examinationBoartId } = parseBody(
            GetPresentationRequest,
            req.query
        );

        const presentationList= await this.usecase.execute({
            id,
            presentationFilter: {
                date,
                groupId,
                examinationBoartId
            }
        });

        const response= GetPresentationResponse.parse({
            message: "Apresentação(ões) retornada(s) com sucesso",
            presentations: presentationList.map((presentation) => ({
                id: presentation.id,
                date: presentation.date,
                group: {
                    codSubj: presentation.group.codSubj,
                    userNameList: presentation.group.userNameList,
                    yearSem: presentation.group.yearSem,
                    project: {
                        title: presentation.group.project.title,
                        partnerName: presentation.group.project.partnerName,
                        extensionHours: presentation.group.project.extensionHours
                    },
                    course: presentation.group.course
                },
                ExaminationBoard: {
                    porfessorNameList: presentation.examinationBoard.porfessorNameList
                }
            }))
        });
        res.status(200).json(response)
    }
}