import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { UpdatePresentationRequest, UpdatePresentationResponse } from "./update_presentation_schema";
import { parseBody } from "../../../shared/utils/parse_body";
import { UpdatePresentationUseCase } from "./update_presentation_usecase";


export class UpdatePresentationController {
    constructor(private readonly usecase: UpdatePresentationUseCase) { }

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const { id, date, groupId, examinationBoardId, classRoom } = parseBody(
            UpdatePresentationRequest,
            req.body
        );

        const updatedPresentation = await this.usecase.execute({
            id,
            updateOptions: {
                date,
                groupId,
                examinationBoardId,
                classRoom
            }
        })

        const response = UpdatePresentationResponse.parse({
            message: "Apresentação foi alterada com sucesso",
            presentation: {
                id: updatedPresentation.id,
                date: updatedPresentation.date,
                classRoom: updatedPresentation.classRoom,
                group: {
                    codSubj: updatedPresentation.group.codSubj,
                    userNameList: updatedPresentation.group.userNameList,
                    yearSem: updatedPresentation.group.yearSem,
                    project: {
                        title: updatedPresentation.group.project.title,
                        partnerName: updatedPresentation.group.project.partnerName,
                        extensionHours: updatedPresentation.group.project.extensionHours
                    },
                    course: updatedPresentation.group.course
                },
                ExaminationBoard: {
                    porfessorNameList: updatedPresentation.examinationBoard.porfessorNameList
                }
            }
        });
        res.status(200).json(response)
    }
}