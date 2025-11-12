import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { GetAllPresentationsRequest, GetAllPresentationsResponse } from "./get_all_presentations_schema";
import { GetAllPresentationsUseCase } from "./get_all_presentations_usecase";
import { parseBody } from "app/shared/utils/parse_body";

export class GetAllPresentationsController {
    constructor(private readonly usecase: GetAllPresentationsUseCase) { }

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const { date, groupId, examinationBoardId, status } = parseBody(
            GetAllPresentationsRequest,
            req.query
        )

        const presentationsList = await this.usecase.execute({
            presentationFilter: {
                date,
                groupId,
                examinationBoardId,
                status
            }
        });

        const response = GetAllPresentationsResponse.parse({
            message: "Lista de Apresentações retornado com sucesso",
            presentations: presentationsList.map((presentation) => ({
                id: presentation.id,
                date: presentation.date,
                classRoomName: presentation.classRoomName,
                status: presentation.status,
                group: {
                    codSubj: presentation.group.codSubj,
                    userNameList: presentation.group.userNameList,
                    yearSem: presentation.group.yearSem,
                    project: {
                        title: presentation.group.project.title,
                        partnerName: presentation.group.project.partnerName,
                        extensionHours: presentation.group.project.extensionHours
                    },
                    courseName: presentation.group.courseName
                },
                ExaminationBoard: {
                    porfessorNameList: presentation.examinationBoard.porfessorNameList
                }
            }))
        });
        res.status(200).json(response)
    }
}